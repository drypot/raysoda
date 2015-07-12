/* TODO

drop procedure BBSFolderDelete
go
create procedure BBSFolderDelete
  @FolderID int
  ,@Result  int output
  as
  delete from BBSFolders
  from BBSFolders F
  where 
    FolderID = @FolderID and 
    (select count(*) from BBSThreads where FolderID = @FolderID) = 0
  select @Result = @@rowcount
go


*/
