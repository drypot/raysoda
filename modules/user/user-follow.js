/* TODO
table UserFavs (
  OwnerUserID   int not null
  ,TargetUserID int not null
  ,primary key (OwnerUserID, TargetUserID)

index TaregetUserIDIdx on UserFavs (TargetUserID);

trigger UserFavInsertTg on UserFavs for insert
  as
    update Users 
    set 
      FavCnt = FavCnt + 1
    from inserted join Users on inserted.TargetUserID = Users.UserID

trigger UserFavDeleteTg on UserFavs for delete
  as
    update Users 
    set 
      FavCnt = FavCnt - 1
    from deleted join Users on deleted.TargetUserID = Users.UserID

procedure UserFavInsert
    @OwnerUserID  int
    ,@TargetUserID  int
    ,@Result    int output
    as

    insert UserFavs(OwnerUserID, TargetUserID)
    select @OwnerUserID, @TargetUserID
    where 
      @OwnerUserID > 0 and
      @OwnerUserID != @TargetUserID and
      -- exists (select * from Users where UserID = @TargetUserID and PhotoCnt > 0) and
      not exists (select * from UserFavs where OwnerUserID = @OwnerUserID and TargetUserID = @TargetUserID) and
      (select count(*) from UserFavs where OwnerUserID = @OwnerUserID) < 300
    select @Result = @@rowcount

procedure UserFavDelete
    @OwnerUserID  int
    ,@TargetUserID  int
    ,@Result    int output
    as

    delete UserFavs
    where OwnerUserID = @OwnerUserID and TargetUserID = @TargetUserID

    select @Result = @@rowcount

procedure UserFavSelectTargetUserList
    @OwnerUserID int
    as

    select UserID, NickName, FavCnt, FIcon
    from Users U join (select TargetUserID from UserFavs where OwnerUserID = @OwnerUserID) TL on U.UserID = TL.TargetUserID
    --where U.Status != 'T'
    order by NickName

procedure UserFavSelectOwnerUserList
    @TargetUserID int
    as

    select UserID, NickName, FavCnt, FIcon
    from Users U join (select OwnerUserID from UserFavs where TargetUserID = @TargetUserID) TL on U.UserID = TL.OwnerUserID
    --where U.Status != 'T'
    order by NickName

procedure UserFavCheckInsertPerm
    @OwnerUserID  int
    ,@TargetUserID  int
    ,@Result    int output
    as

    select @Result = 0 -- ok
    if (exists (select * from UserFavs where OwnerUserID = @OwnerUserID and TargetUserID = @TargetUserID))
      select @Result = 2 -- already exists
    else if ((select count(*) from UserFavs where OwnerUserID = @OwnerUserID) > 299)
      select @Result = 1 -- full

        
*/

