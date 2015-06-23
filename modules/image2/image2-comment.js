
/* TODO

procedure BoxPCInsert
    @PhotoID int
    ,@UserID int
    ,@GuestName nvarchar(16)
    ,@GuestPassword nvarchar(16)
    ,@Comment nvarchar(4000)
    as

    declare @CommentID int
    exec SeqNextValue 'boxpcmt', @CommentID output

    insert BoxPhotoComments(CommentID, PhotoID, UserID, GuestName, GuestPassword, Comment)
    values(@CommentID, @PhotoID, @UserID, @GuestName, @GuestPassword, @Comment)

    update BoxPhotos
    set UDate = getdate()
    where PhotoID = @PhotoID
  go

procedure BoxPCDelete
    @PhotoID  int
    ,@CommentID int
    ,@UserID  int = null
    ,@GuestPassword nvarchar(16) = null
    as

    delete BoxPhotoComments
    where 
      CommentID = @CommentID and
      PhotoID = @PhotoID and
      (
        (@UserID is null and @GuestPassword is null) or 
        (@UserID is not null and 
          (UserID = @UserID or exists (select * from BoxPhotos where UserID = @UserID and PhotoID = @PhotoID))
        ) or
        (@GuestPassword is not null and GuestPassword = @GuestPassword)
      ) 
  go

procedure BoxPCUpdate
    @PhotoID  int
    ,@CommentID int
    ,@UserID  int = null
    ,@GuestPassword nvarchar(16) = null
    ,@GuestName nvarchar(16)
    ,@Comment nvarchar(4000)
    as

    update BoxPhotoComments
    set Comment = @Comment, GuestName = @GuestName
    where 
      CommentID = @CommentID and
      PhotoID = @PhotoID and
      (
        (@UserID is null and @GuestPassword is null) or 
        (@UserID is not null and UserID = @UserID) or
        (@GuestPassword is not null and GuestPassword = @GuestPassword)
      ) 
  go

procedure BoxPCSelectList
    @PhotoID int
    as
    select UserID, GuestName, GuestPassword, Comment, CDate
    from BoxPhotoComments
    where PhotoID = @PhotoID
    order by CDate
  go

procedure BoxPCSelect
    @CommentID  int
    as
    select *
    from BoxPhotoComments
    where CommentID = @CommentID
  go
*/