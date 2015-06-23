/* TODO

procedure BBSSelectArticle
  @ArticleID  int
  as

  select *
  from BBSArticles
  where ArticleID = @ArticleID

  select T.*
  from BBSArticles A join BBSThreads T on A.ThreadID = T.ThreadID
  where ArticleID = @ArticleID

procedure BBSSelectThreadArticles
  @UserID  int = null
  ,@ThreadID  int
  as

  if (@UserID is null)
    select *, 'N' as Subsc 
    from BBSThreads
    where ThreadID = @ThreadID
  else
    select 
      *, 
      case when exists (select * from BBSUsersThreads where UserID = @UserID and ThreadID = @ThreadID) then 'Y' else 'N' end as Subsc
    from BBSThreads
    where ThreadID = @ThreadID
  

  select ArticleID, UserID, [Text], Music, CDate
  from BBSArticles  
  where ThreadID = @ThreadID
  order by CDate
go
*/