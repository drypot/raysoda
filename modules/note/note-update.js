/* TODO

procedure BBSUpdate
  @ArticleID  int
  ,@Text    ntext = null
  ,@Music   varchar(1024)
  as

  if (@Text is null)
    update BBSArticles 
    set 
      Music = @Music
    where ArticleID = @ArticleID
  else
    update BBSArticles 
    set 
      [Text] = @Text,
      Music = @Music
    where ArticleID = @ArticleID
go

procedure BBSUpdateThread
  @ThreadID int
  ,@Title nvarchar(128) = null

  ,@FolderID  int = null
  ,@OwnerType char(1) = null
  ,@OwnerID int = null
  ,@Lock char(1) = null
  
  ,@Hidden char(1) = null
  as
  
  if (@Title is not null)
    update BBSThreads 
    set Title = @Title 
    where ThreadID = @ThreadID

  if (@Hidden is not null)
    update BBSThreads 
    set Hidden = @Hidden 
    where ThreadID = @ThreadID

  if @FolderID is not null
    update  BBSThreads 
    set 
      Lock = @Lock
      ,FolderID = @FolderID
    where ThreadID = @ThreadID and exists (select * from BBSFolders where OwnerType = @OwnerType and OwnerID = @OwnerID and FolderID = @FolderID)
go
*/