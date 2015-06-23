/*

procedure BoxFolderInsert
  @UserID   int
  ,@SortKey char(1)
  ,@SortDir char(1)
  ,@Func    char(1)
  ,@FHidden char(1)
  ,@SortValue int
  ,@ThumbCount  int = 15
  ,@Title   nvarchar(128)
  ,@Music   varchar(1024)
  ,@Comment ntext
  ,@Note  ntext
  as

  declare @FolderID int

  exec SeqNextValue 'boxfolder', @FolderID output

  insert BoxFolders(FolderID, UserID, SortKey, SortDir, Func, FHidden, Title, Music, Comment, Note, SortValue, ThumbCount)
  select @FolderID, @UserID, @SortKey, @SortDir, @Func, @FHidden, @Title, @Music, @Comment, @Note, case when @SortValue = 0 then isnull(max(SortValue),0) + 10 else @SortValue end, @ThumbCount
    from BoxFolders where UserID = @UserID and Func = @Func
go

trigger BoxFoldersDeleteTg on BoxFolders for delete
  as
    delete BoxFoldersPhotos
    from  BoxFoldersPhotos FP join deleted F on FP.FolderID = F.FolderID

    delete BoxFolderComments
    from BoxFolderComments C join deleted D on C.FolderID = D.FolderID

    delete BoxFrontFolders
    from  BoxFrontFolders FF join deleted F on FF.FolderID = F.FolderID
  go

procedure BoxFolderDelete
  @FolderID int
  ,@Result  int output
  as
  
  delete from BoxFolders
  where 
    FolderID = @FolderID and 
    (Func != 'S' or (select count(*) from BoxFoldersPhotos where FolderID = @FolderID) = 0)
  select @Result = @@rowcount
go

procedure BoxFolderUpdate
  @FolderID int
  ,@UserID    int
  ,@SortKey char(1)
  ,@SortDir char(1)
  ,@FHidden char(1)
  ,@SortValue int
  ,@ThumbCount  int
  ,@Title   nvarchar(128)
  ,@Music   varchar(1024)
  ,@Comment ntext
  ,@Note    ntext
  as

  update BoxFolders
    set SortKey = @SortKey, SortDir = @SortDir, FHidden = @FHidden, SortValue =@SortValue, Title = @Title, Music = @Music, Comment = @Comment, Note = @Note, ThumbCount = @ThumbCount
    where FolderID = @FolderID and UserID = @UserID 
go

procedure BoxFolderSelect
  @FolderID int
  as
  select *, (select count(*) from BoxFoldersPhotos where FolderID = @FolderID) as PhotoCnt  from BoxFolders where FolderID = @FolderID
go

procedure BoxFolderSelectEx
  @FolderID int
  ,@UserID    int
  as
  select * from BoxFolders where FolderID = @FolderID and UserID = @UserID

  if (@@rowcount > 0)
  begin
    declare @SortKey char(1)
    declare @SortDir char(1)
    select @SortKey = SortKey, @SortDir = SortDir from BoxFolders where FolderID = @FolderID and UserID = @UserID

    if (@SortDir = 'A')
      select P.PhotoID, P.CDate, P.Hit, F.SortValue, P.Title, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID)
      from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
      where F.FolderID = @FolderID
      order by SortValue asc
    else 
      select P.PhotoID, P.CDate, P.Hit, F.SortValue,  P.Title, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID)
      from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
      where F.FolderID = @FolderID
      order by SortValue desc

    --*
    select CommentID, UserID, Comment, CDate
    from BoxFolderComments
    where FolderID = @FolderID
    order by CDate
    --*
  end

procedure BoxFolderSelectConcepts
  @UserID int
  as
  select top 50 FolderID, Title
  from BoxFolders
  where UserID = @UserID and Func = 'C'
  order by Title asc
go

procedure BoxFolderSelectListItem
  @FolderID int
  ,@Count   int
  as

  declare @SortDir char(1)

  select @SortDir = SortDir
  from BoxFolders where FolderID = @FolderID

  select Func, Title, Hit, CDate as [Date], RepCnt = (select count(*) from BoxFolderComments where FolderID = @FolderID), 
    PhotoCnt = (select count(*) from BoxFoldersPhotos where FolderID = @FolderID)
  from BoxFolders where FolderID = @FolderID

  if (@SortDir = 'A')
    select top (@Count) F.PhotoID, P.Hit, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = F.PhotoID), P.CDate, P.title
    from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
    where F.FolderID = @FolderID
    order by F.SortValue asc
  else
    select top (@Count) F.PhotoID, P.Hit, RepCnt = (select count(*) from BoxPhotoComments where PhotoID = F.PhotoID), P.CDate, P.title
    from BoxFoldersPhotos F join BoxPhotos P on F.PhotoID = P.PhotoID
    where F.FolderID = @FolderID
    order by F.SortValue desc
go

procedure BoxFolderSelectList
  @UserID     int
  ,@SortKey   char(1) -- C: CDate, U: UDate, T:Title
  ,@SortDir   char(1)
  ,@Func      char(1)
  ,@PageSize    int
  ,@PageNumber  int
  ,@PageCount   int output
  ,@RowCount    int output
  ,@Search    nvarchar(64) = ''
  as

  declare @HeadSize int
  declare @TailSize int
  declare @ReturnSize int

  declare @Start int
  declare @End Int

  if (@Search = '') 
    begin
      select @RowCount = count(*)
      from BoxFolders
      where UserID = @UserID and Func = @Func
          
      select @PageCount =  (@RowCount - 1) / @PageSize + 1
      select @HeadSize = @PageSize * (@PageNumber + 1)
      select @TailSize = @RowCount - @PageSize * @PageNumber
      select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

      if (@TailSize < 0) return;

      if (@SortKey = 'V')
        select I.FolderID, F.ThumbCount
        from (select top (@ReturnSize) FolderID, SortValue from (select top (@HeadSize) FolderID, SortValue from BoxFolders where UserID = @UserID  and Func = @Func order by SortValue desc, FolderID desc) I order by SortValue, FolderID) I join BoxFolders F on I.FolderID = F.FolderID
        order by I.SortValue desc, I.FolderID desc
      else if (@SortKey = 'U')
        select I.FolderID, F.ThumbCount
        from (select top (@ReturnSize) FolderID, UDate from (select top (@HeadSize) FolderID, UDate from BoxFolders where UserID = @UserID  and Func = @Func order by UDate desc) I order by UDate) I join BoxFolders F on I.FolderID = F.FolderID
        order by I.UDate desc
    end
go


*/
