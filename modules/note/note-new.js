/* TODO

procedure BBSInsert
  @ArticleID    int = null output
  ,@FolderID    int = null
  ,@ThreadID    int
  ,@UserID    int
  ,@PhotoID   int = 0
  ,@Hidden    char(1) = null
  ,@Title     nvarchar(128) = null
  ,@Music     varchar(1024)
  ,@Text      ntext
  ,@Result    int output
  as

  select @Result = 0
  exec SeqNextValue 'bbs', @ArticleID output
  
  if (@ThreadID = 0)
  begin
    begin tran
      if (@PhotoID = 0 or exists (select * from Photos where UserID != @UserID and PhotoID = @PhotoID))
      begin
        insert 
        BBSThreads(ThreadID, UserID, FolderID, Title, Hidden)
        values(@ArticleID, @UserID, @FolderID, @Title, @Hidden)

        insert 
        into BBSArticles(ArticleID, ThreadID, UserID, [Text], Music)
        values (@ArticleID, @ArticleID, @UserID, @Text, @Music)

        if (@PhotoID is not null)
          insert
          BBSThreadsPhotos(ThreadID, PhotoID)
          values (@ArticleID, @PhotoID)

        insert
        BBSUsersThreads(UserID, ThreadID)
        values(@UserID, @ArticleID)
        
        select @Result = 1
      end
    commit tran
  end
  else  
  begin
    begin tran
      if (exists (select * from BBSThreads where ThreadID = @ThreadID and Lock = 'N'))
      begin
        update BBSThreads
        set UDate = getdate()
        where ThreadID = @ThreadID
        
        insert 
        into BBSArticles(ArticleID, ThreadID, UserID, [Text], Music)
        values (@ArticleID, @ThreadID, @UserID, @Text, @Music)

        if (not exists (select * from BBSUsersThreads where UserID = @UserID and ThreadID = @ThreadID))
          insert
          BBSUsersThreads(UserID, ThreadID)
          values(@UserID, @ThreadID)

        select @Result = 1
      end
    commit tran
  end
go


*/