
/* TODO

procedure BoxPhotoInsert
    @PhotoID int output
    ,@UserID int
    ,@FolderID int
    ,@Border tinyint
    ,@Title nvarchar(128)
    ,@Comment ntext
    ,@Music varchar(1024)
    ,@RowCount int output
    as

    if (exists (select * from BoxFolders where UserID = @UserID and FolderID = @FolderID and Func = 'S'))
    begin
      exec SeqNextValue 'boxphoto', @PhotoID output
      
      insert 
      BoxPhotos(PhotoID, UserID, Border, Title, Comment, Music)
      values(@PhotoID, @UserID, @Border, @Title, @Comment, @Music)

      insert
      BoxFoldersPhotos(FolderID, PhotoID, SortValue)
      select @FolderID, @PhotoID, isnull(max(SortValue),0) + 10 from BoxFoldersPhotos where FolderID = @FolderID

      select @RowCount = 1
    end
    else
      select @RowCount = 0
  go

*/
