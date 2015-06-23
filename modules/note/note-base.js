
/* TODO

procedure BBSSelectContext
  @ThreadID int = 0
  ,@ArticleID int = 0
  ,@FolderID int = 0
  as

  if (@ThreadID != 0)
    select F.*
    from 
      BBSThreads T join BBSFolders F on F.FolderID = T.FolderID
    where 
      T.ThreadID = @ThreadID
  else
    select *
    from 
      BBSFolders
    where 
      FolderID = @FolderID

  if (@ArticleID != 0) -- Edit 
    select A.UserID , A.CDate
    from 
      BBSArticles A join BBSThreads T on A.ThreadID = T.ThreadID
    where 
      A.ArticleID = @ArticleID and
      T.ThreadID = @ThreadID
go


procedure BBSUnsubscribe
  @UserID int
  ,@ThreadID int
  as

  --*
  begin tran
    if (
      not exists (
        select * 
        from BBSArticles 
        where UserID = @UserID and ThreadID = @ThreadID
      )
    )
      delete from BBSUsersThreads
      where UserID = @UserID and ThreadID = @ThreadID
  commit tran
  --*

  delete from BBSUsersThreads
  where UserID = @UserID and ThreadID = @ThreadID
go


procedure BBSSubscribe
  @UserID int
  ,@ThreadID int
  as

  begin tran
    if (
      not exists (
        select * 
        from BBSUsersThreads 
        where UserID = @UserID and ThreadID = @ThreadID
      )
    )
      insert BBSUsersThreads(UserID, ThreadID)
      values(@UserID, @ThreadID)
  commit tran
go

procedure BBSSelectArticleUserID
  @ArticleID  int
  ,@UserID int output
  as

  select @UserID = UserID
  from BBSArticles
  where ArticleID = @ArticleID
*/
