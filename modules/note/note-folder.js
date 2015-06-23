/* TODO


drop procedure BBSFolderInsert
go
create procedure BBSFolderInsert
  @OwnerType char(1)
  ,@OwnerID int
  ,@SortValue int = 0
  ,@SampleDay int = 7
  ,@SampleMin int = 10
  ,@ATTE char(1) = 'Y'
  ,@ATTR char(1) = 'Y'
  ,@ATTM char(1) = 'Y'
  ,@ATTO char(1) = 'N'
  ,@DisGuestNew char(1) = 'N'
  ,@DisGuestReply char(1) = 'N'
  ,@Hidden char(1) = 'N'
  ,@Photo char(1) = 'N'
  ,@Title nvarchar(128)
  ,@Result int output
  as

  declare @FolderID int

  exec SeqNextValue 'bbsfolder', @FolderID output

  --*
  if (
    @OwnerType = 'A' or
    (@OwnerType = 'B' and (select count(*) from BBSFolders where OwnerType = @OwnerType and OwnerID = @OwnerID) < 7)
  )
  begin
  --/
    insert 
      BBSFolders(
        FolderID 
        ,OwnerType 
        ,OwnerID 
        ,SortValue
        ,SampleDay 
        ,SampleMin 
        ,ATTE
        ,ATTR 
        ,ATTM 
        ,ATTO 
        ,DisGuestNew
        ,DisGuestReply
        ,HIdden
        ,Photo
        ,Title
      )
    select 
      @FolderID
      ,@OwnerType
      ,@OwnerID
      ,case when @SortValue = 0 then isnull(max(SortValue),0) + 10 else @SortValue end
      ,@SampleDay
      ,@SampleMin 
      ,@ATTE
      ,@ATTR
      ,@ATTM
      ,@ATTO
      ,@DisGuestNew
      ,@DisGuestReply
      ,@HIdden
      ,@Photo
      ,@Title
    from BBSFolders
    where 
      OwnerType = @OwnerType and 
      OwnerID = @OwnerID
    select @Result = @@rowcount
  --*
  end
  else
    select @Result = 0
  --*
go

drop procedure BBSFolderDelete
go
create procedure BBSFolderDelete
  @FolderID int
  ,@Result  int output
  as
  delete from BBSFolders
  from BBSFolders F
  where 
    FolderID = @FolderID and 
    (select count(*) from BBSThreads where FolderID = @FolderID) = 0
  select @Result = @@rowcount
go

drop procedure BBSFolderUpdate
go
create procedure BBSFolderUpdate
  @FolderID int
  ,@SortValue int
  ,@SampleDay int
  ,@SampleMin int
  ,@ATTE char(1)
  ,@ATTR char(1)
  ,@ATTM char(1)
  ,@ATTO char(1)
  ,@DisGuestNew char(1)
  ,@DisGuestReply char(1)
  ,@Hidden char(1)
  ,@Photo char(1)
  ,@Title nvarchar(128)
  as
  update BBSFolders 
  set
    SortValue = @SortValue
    ,SampleDay = @SampleDay
    ,SampleMin = @SampleMin
    ,ATTE = @ATTE
    ,ATTR = @ATTR
    ,ATTM = @ATTM
    ,ATTO = @ATTO
    ,DisGuestNew = @DisGuestNew
    ,DisGuestReply = @DisGuestReply
    ,Hidden = @Hidden
    ,Photo = @Photo
    ,Title = @Title
  where FolderID = @FolderID
go

drop procedure BBSFolderSelect
go
create procedure BBSFolderSelect
  @FolderID int
  as
  select * from BBSFolders where FolderID = @FolderID
go

drop procedure BBSFolderSelectList 
go
create procedure BBSFolderSelectList
  @OwnerType char(1)
  ,@OwnerID int
  ,@IncPhoto char(1)
  ,@IncDisGuestNew char(1)
  ,@IncHidden char(1)
  as
  
  select FolderID, Title, HIdden
  from BBSFolders
  where 
    OwnerType = @OwnerType and 
    OwnerID = @OwnerID and 
    (@IncPhoto = 'Y' or Photo = 'N') and 
    (@IncDisGuestNew = 'Y' or DisGuestNew = 'N') and
    (@IncHidden = 'Y' or Hidden = 'N')
  order by SortValue
go

 
drop procedure BBSFolderSelectSample
go
create procedure BBSFolderSelectSample
  @FolderID int
  as

  declare @Count1 int
  declare @Count2 int
  
  select 
    @Count1 =SampleMin, 
    @Count2 = (select count(*) from BBSThreads where FolderID = @FolderID and UDate >= getdate() - SampleDay)
  from BBSFolders F
  where FolderID = @FolderID
  
  if (@Count1 < @Count2)
    select @Count1 = @Count2

  select top (@Count1)
  ThreadID, UserID, Title, Hit, UDate, Hidden, RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
  from BBSThreads T
  where FolderID = @FolderID
  order by UDate desc
go

*/
