/* TODO

table Photos (
  PhotoID int not null
  ,UserID int not null
  ,CDate datetime not null default getdate()
  ,UDate datetime not null default getdate() -- 삭제 고
  ,Rating int not null default 0
  ,PanelRating int not null default 0 -- 삭제
  ,Hit int not null default 0 -- 삭제 고려
  ,Border tinyint not null default 1 -- 삭제
  ,Title nvarchar(128) not null default '' -- 삭제 고려
  ,Comment ntext not null default ''
  --,Exif ntext not null default '' -- 삭제
  ,Music varchar(1024) default '' -- 삭제
  ,primary key nonclustered (PhotoID)
)
go

create index UserCDateIdx on Photos(UserID, CDate desc)
create clustered index CDateIdx on Photos(CDate desc)

-----

table PhotoCategories (
  CategoryID smallint not null
  ,[Desc] nvarchar(32) not null
  ,primary key (CategoryID)
) -- 삭제

table CategoriesPhotos (
  CategoryID smallint not null
  ,PhotoID int not null
  ,primary key (CategoryID, PhotoID)
) -- 삭제

view CategoriesCDatesPhotos with schemabinding -- 삭제
as
select CategoryID, CDate, C.PhotoID
from dbo.CategoriesPhotos C join dbo.Photos P on C.PhotoID = P.PhotoID
go

-----

table PhotoCrits (
  PhotoID int not null
  ,UserID int not null
  --,PUserID int not null
  ,CDate datetime not null default getdate()
  ,Rating tinyint not null default 1
  ,Comment nvarchar(4000) not null default ''
  ,primary key nonclustered (PhotoID, UserID)
)
go

create clustered index PhotoCDateIdx on PhotoCrits(PhotoID, CDate)

create index UserCDatePhotoIdx on PhotoCrits(UserID, CDate, PhotoID)

*/
