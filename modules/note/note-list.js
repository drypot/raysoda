/* TODO

procedure BBSSelectThreadListByFolder -- by Category
  @FolderID   int
  ,@PageSize    int = 32
  ,@PageNumber  int
  ,@PageCount   int output
  ,@Search    nvarchar(64) = ''
  ,@SortKey   char(1)
  ,@SortDir   char(1)
  as

  declare @RowCount int
  declare @HeadSize int
  declare @TailSize int
  declare @ReturnSize int

  declare @Start int
  declare @End Int

  if (@Search = '') 
    begin
      select @RowCount = count(*)
      from BBSThreads
      where FolderID = @FolderID
          
      select @PageCount =  (@RowCount - 1) / @PageSize + 1
      select @HeadSize = @PageSize * (@PageNumber + 1)
      select @TailSize = @RowCount - @PageSize * @PageNumber
      select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

      if (@TailSize < 0) return;

      if (@SortKey = 'C')
        exec (
          'select I.ThreadID, Title, Hit, I.CDate as [Date], UserID, Hidden, RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID) ' +
          'from (select top ' + @ReturnSize + ' * from (select top ' + @HeadSize + ' ThreadID, CDate from BBSThreads where FolderID = ' + @FolderID + ' order by CDate desc) I order by CDate) I ' +
          'join BBSThreads T on I.ThreadID = T.ThreadID ' +
          'order by I.CDate desc'
        )
      else
        exec (
          'select I.ThreadID, Title, Hit, I.UDate as [Date], UserID, Hidden, RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID) ' +
          'from (select top ' + @ReturnSize + ' * from (select top ' + @HeadSize + ' ThreadID, UDate from BBSThreads where FolderID = ' + @FolderID + ' order by UDate desc) I order by UDate) I ' +
          'join BBSThreads T on I.ThreadID = T.ThreadID ' +
          'order by I.UDate desc'
        )
    end
  else begin
    begin
      create table #NumberedThreads (
        RowNum int identity(1,1) not null primary key,
        ThreadID int not null
      )

      set @Search = '%' + @Search + '%'

      if (@SortKey = 'C')
        insert into #NumberedThreads(ThreadID)
        select ThreadID
        from BBSThreads T
        where FolderID = @FolderID and Title like @Search
        order by CDate desc
      else 
        insert into #NumberedThreads(ThreadID)
        select ThreadID
        from BBSThreads T
        where FolderID = @FolderID and Title like @Search
        order by UDate desc

      set @RowCount = @@rowcount
      set @PageCount =  (@RowCount - 1) / @PageSize + 1

      if (@PageNumber >= @PageCount)
        select @PageNumber = 0

      set @Start = @PageSize * @PageNumber + 1
      set @End = @Start + @PageSize - 1

      if (@SortKey = 'C')
        select
          T.ThreadID, Title, Hit, CDate as [Date], UserID, Hidden, 
          RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
        from 
          #NumberedThreads NT 
          join BBSThreads T on NT.ThreadID = T.ThreadID 
        where NT.RowNum between @Start and @End
        option (force order)
      else 
        select
          T.ThreadID, Title, Hit, UDate as [Date], UserID, Hidden, 
          RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
        from 
          #NumberedThreads NT 
          join BBSThreads T on NT.ThreadID = T.ThreadID 
        where NT.RowNum between @Start and @End
        option (force order)

      drop table #NumberedThreads
    end
  end
go

procedure BBSSelectThreadListUser
  @UserID   int
  ,@PageSize    int = 32
  ,@PageNumber  int
  ,@PageCount   int output
  ,@Search    nvarchar(64) = ''
  as

  declare @RowCount int
  declare @HeadSize int
  declare @TailSize int
  declare @ReturnSize int

  declare @Start int
  declare @End Int

  if (@Search = '') 
    begin
      select @RowCount = count(*)
      from BBSUsersThreadsSorted with (noexpand)
      where 
        UserID = @UserID
          
      select @PageCount =  (@RowCount - 1) / @PageSize + 1
      select @HeadSize = @PageSize * (@PageNumber + 1)
      select @TailSize = @RowCount - @PageSize * @PageNumber
      select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

      if (@TailSize < 0) return;

      select T.ThreadID, T.Title, T.Hit, T.UDate as [Date], T.UserID, T.Hidden, RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
      from
        (select top (@ReturnSize) ThreadID
        from
          (select top (@HeadSize) ThreadID, UDate
          from BBSUsersThreadsSorted with (noexpand)
          where UserID = @UserID
          order by UDate desc) I
        order by UDate) I
        join BBSThreads T on I.ThreadID = T.ThreadID
        join BBSFolders F on T.FolderID = F.FolderID
      where F.Hidden = 'N'
      order by T.UDate desc
    end
  else begin
    begin
      create table #NumberedThreads (
        RowNum int identity(1,1) not null primary key,
        ThreadID int not null
      )

      set @Search = '%' + @Search + '%'

      insert into #NumberedThreads(ThreadID)
      select T1.ThreadID
      from BBSUsersThreadsSorted T1 with (noexpand) join BBSThreads T2 on T1.ThreadID = T2.ThreadID
      where T1.UserID = @UserID and T2.Title like @Search
      order by T1.UDate desc

      set @RowCount = @@rowcount
      set @PageCount =  (@RowCount - 1) / @PageSize + 1

      if (@PageNumber >= @PageCount)
        select @PageNumber = 0

      set @Start = @PageSize * @PageNumber + 1
      set @End = @Start + @PageSize - 1

      select
        T.ThreadID, Title, Hit, UDate as [Date], UserID, Hidden, 
        RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
      from 
        #NumberedThreads NT 
        join BBSThreads T on NT.ThreadID = T.ThreadID 
      where NT.RowNum between @Start and @End
      option (force order)

      drop table #NumberedThreads
    end
  end
go

procedure BBSSelectThreadListUserSamp -- 개인 게시물 전체의 셈플
  @UserID   int
  as

  select
    T.ThreadID, T.Title, T.Hit, UT.UDate as [Date], T.UserID, T.Hidden, 
    RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID) 
  from 
    BBSUsersThreadsSorted UT with (noexpand)
    join BBSThreads T on UT.ThreadID = T.ThreadID 
    join BBSFolders F on T.FolderID = F.FolderID
  where 
    UT.UserID = @UserID and
    Ut.UDate > getdate() - 3 and 
    F.Hidden = 'N'
  order by UT.UDate desc
go


*/