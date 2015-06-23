
/* TODO

procedure BoxPhotoUpdate
    @PhotoID int
    ,@FolderID int
    ,@UserID int = null output
    ,@Border tinyint
    ,@Title nvarchar(128)
    ,@Comment ntext
    ,@Music varchar(1024)
    ,@SortValue int
    ,@RowCount int output
    as
    
    if (@UserID is null)
      select @UserID = UserID from BoxPhotos where PhotoID = @PhotoID

    update BoxPhotos
    set Title = @Title, Comment = @Comment, Music = @Music, Border=@Border
    where PhotoID = @PhotoID and UserID = @UserID

    select @RowCount = @@rowcount

    if (@RowCount > 0) 
      update BoxFoldersPhotos
      set SortValue = @SortValue
      where FolderID = @FolderID and PhotoID = @PhotoID
  go

procedure BoxPhotoUpdateFolder
    @PhotoID int
    ,@UserID int
    ,@FolderTitle nvarchar(128)
    ,@RowCount int output
    as

    begin tran
    
      select @RowCount = count(*) from BoxFolders where UserID = @UserID and Title = @FolderTitle and Func='S'
      
      if (@RowCount = 1)
      begin
          declare @FolderID int

          select @FolderID = FolderID from BoxFolders where UserID = @UserID and Title = @FolderTitle and Func='S'

          delete BoxFoldersPhotos 
          from BoxFoldersPhotos FP join BoxFolders F on FP.FolderID = F.FolderID
          where FP.PhotoID = @PhotoID and F.Func = 'S'
          
          insert
          BoxFoldersPhotos(FolderID, PhotoID, SortValue)
          select @FolderID, @PhotoID, isnull(max(SortValue),0) + 10 from BoxFoldersPhotos where FolderID = @FolderID
      end

    commit tran
  go

*/
