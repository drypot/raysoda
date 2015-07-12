/* TODO

trigger PhotoCritsInsertTg on PhotoCrits for insert
  as
    update Photos
    set 
      Photos.Rating = Photos.Rating + inserted.Rating, UDate = case when len(inserted.Comment) > 0 then getdate() else UDate end 
      ,Photos.PanelRating = Photos.PanelRating + (inserted.Rating) * (select case when FPanel = 'Y' then 1 else 0 end from Users where UserID = inserted.UserID)
    from inserted join Photos on inserted.PhotoID = Photos.PhotoID
  go

procedure PhotoInsertCrit
    @PhotoID int
    ,@UserID int
    ,@Rating tinyint
    ,@Comment nvarchar(4000)
    ,@Result int output
    as

    declare @today datetime
    select @today = getdate()
    exec GetDatePart @today output

    select @Result = 0

    begin tran
      if (exists (select * from Photos where PhotoID = @PhotoID and UserID != @UserID))
      begin
        update PhotoCrits
        set Comment = @Comment, Rating = @Rating
        where PhotoID = @PhotoID and UserID = @UserID

        if (@@rowcount = 0) 
        begin
          insert PhotoCrits(PhotoID, UserID, Rating, Comment)
          values(@PhotoID, @UserID, @Rating, @Comment)
        end
      end
      select @Result = 45 - isnull(sum(Rating),0) from PhotoCrits where UserID = @UserID and CDate >= @today
    if (@Result < 0)
    begin
      rollback tran
    end
    else
      commit tran
  go


trigger PhotoCritsDeleteTg on PhotoCrits for delete
  as
    update Photos
    set 
      Photos.Rating = Photos.Rating - deleted.Rating
      ,Photos.PanelRating = Photos.PanelRating + (- deleted.Rating) * (select case when FPanel = 'Y' then 1 else 0 end from Users where UserID = deleted.UserID)
    from deleted join Photos on deleted.PhotoID = Photos.PhotoID
  go

procedure PhotoDeleteCrit
    @PhotoID int
    ,@UserID int
    ,@Result int output
    as

    declare @today datetime
    select @today = getdate()
    exec GetDatePart @today output

    delete PhotoCrits
    where PhotoID = @PhotoID and UserID = @UserID
    select @Result = 45 - isnull(sum(Rating),0) from PhotoCrits where UserID = @UserID and CDate >= @today
  go


trigger PhotoCritsUpdateTg on PhotoCrits for update
  as
    update Photos
    set 
      UDate = case when len(inserted.Comment) > 0 then getdate() else UDate end
      ,Photos.Rating = Photos.Rating - deleted.Rating + inserted.Rating
      ,Photos.PanelRating = Photos.PanelRating + (- deleted.Rating + inserted.Rating) * (select case when FPanel = 'Y' then 1 else 0 end from Users where UserID = inserted.UserID)
    from 
      deleted join inserted on deleted.PhotoID = inserted.PhotoID and deleted.UserID = inserted.UserID 
      join Photos on inserted.PhotoID = Photos.PhotoID
  go

procedure PhotoSelectCrit
    @PhotoID int
    ,@UserID int
    as
    select Comment, Rating
    from PhotoCrits
    where PhotoID = @PhotoID and UserID = @UserID
  go
*/
