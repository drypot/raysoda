
/* TODO

procedure BoxPhotoSelect
    @PhotoID int
    as

    select UserID
    from BoxPhotos
    where PhotoID = @PhotoID
  go

procedure BoxPhotoSelectExE
    @PhotoID int
    ,@FolderID int
    as

    select Title, Comment, Music, Border
    from BoxPhotos
    where PhotoID = @PhotoID

    select FolderID 
    from BoxFoldersPhotos
    where PhotoID = @PhotoID

    select SortValue
    from BoxFoldersPhotos
    where FolderID = @FolderID and PhotoID = @PhotoID
  go

procedure BoxPhotoSelectExV
    @PhotoID int
    ,@SortKey char(1) = null
    ,@SortDir char(1) = null
    ,@FolderID int = null
    as

    select UserID, Title, Hit, Comment, Music, CDate, Border
    from BoxPhotos
    where PhotoID = @PhotoID

    select FP.FolderID, F.Title, F.Func, F.Note
    from BoxFoldersPhotos FP join BoxFolders F on FP.FolderID = F.FolderID
    where FP.PhotoID = @PhotoID
    order by F.Func desc, F.Title 

    -- BoxPhotoSelectComments
    select CommentID, UserID, GuestName, Comment, CDate
    from BoxPhotoComments
    where PhotoID = @PhotoID
    order by CDate
  go

  
*/
