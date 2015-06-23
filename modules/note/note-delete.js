/* TODO

procedure BBSDelete
  @ArticleID  int
  as

  if (exists (select * from BBSThreads where ThreadID = @ArticleID))
    begin
      begin tran
        select UserID, ArticleID 
        from BBSArticles 
        where ThreadID = @ArticleID
        
        delete from BBSArticles
        where ThreadID = @ArticleID

        delete from BBSThreads
        where ThreadID = @ArticleID

        delete from BBSThreadsPhotos
        where ThreadID = @ArticleID
        
        delete from BBSUsersThreads
        where ThreadID = @ArticleID
      commit tran
    end
  else
    begin
      begin tran
        declare @UserID int
        declare @ThreadID int
        
        select @UserID = UserID, @ThreadID = ThreadID from BBSArticles where ArticleID = @ArticleID
        
        --*
        if (
          (
            select count(*) 
            from BBSArticles 
            where UserID = @UserID and ThreadID = @ThreadID
          ) = 1
        )
          delete from BBSUsersThreads
          where UserID = @UserID and ThreadID = @ThreadID
        --*

        select UserID, ArticleID from BBSArticles 
        where ArticleID = @ArticleID
        
        delete from BBSArticles
        where ArticleID = @ArticleID
        
      commit tran
    end
go

*/