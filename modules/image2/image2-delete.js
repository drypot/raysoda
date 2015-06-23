
/* TODO

trigger BoxPhotosDeleteTg on BoxPhotos for delete
  as
    delete BoxFoldersPhotos
    from BoxFoldersPhotos F join deleted D on F.PhotoID = D.PhotoID

    delete BoxPhotoComments
    from BoxPhotoComments C join deleted D on C.PhotoID = D.PhotoID
  go

procedure BoxPhotoDelete
    @PhotoID int output
    ,@UserID int = null output
    ,@RowCount int output
    as
    
    if (@UserID is null)
      select @UserID = UserID from BoxPhotos where PhotoID = @PhotoID
      
    delete BoxPhotos
    where 
      PhotoID = @PhotoID and 
      UserID = @UserID

    select @RowCount = @@rowcount
  go

*/



