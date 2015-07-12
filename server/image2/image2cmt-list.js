/* TODO

procedure BoxPCSelectList
    @PhotoID int
    as
    select UserID, GuestName, GuestPassword, Comment, CDate
    from BoxPhotoComments
    where PhotoID = @PhotoID
    order by CDate
  go

*/