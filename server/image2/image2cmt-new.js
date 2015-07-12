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

*/