/* TODO

procedure PhotoSelectUserRecent
    @UserID int
    ,@CDate datetime
    as
    select top 5 P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
      from Photos P
      where P.UserID = @UserID and P.CDate <= @CDate
      order by P.CDate desc
      
  go
*/
