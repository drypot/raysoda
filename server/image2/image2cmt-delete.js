/* TODO


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

*/