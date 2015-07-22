/* TODO

table Users (
  UserID    int not null
  ,Status   char(1) not null -- Status : N:New  C:Common  T:Terminated -> v: valid, d: deactivated
  ,CDate    datetime not null default getdate()
  ,ADate    datetime not null default getdate()
  ,PDate    datetime not null default getdate() -- 최근 업로드 시간, 삭제 대상
  ,PhotoCnt int not null default 0 -- 삭제
  ,Rating   int not null default 0 -- 삭제
  ,FavCnt   int not null default 0 -- 삭제
  
  ,FIcon    char(1) not null default 'N' -- 삭제
  ,FMusic   char(1) not null default 'N' -- 삭제
  ,FScore   char(1) not null default 'Y' -- 삭제
  ,FGoC   char(1) not null default 'Y' -- 추천후 Go to Catalog -- 삭제 
  ,FPanel   char(1) not null default 'N' -- 삭제
  ,FDisWrite  char(1) not null default 'N' -- 삭제
  ,FSeed    char(1) not null default 'Y' -- 초대 가능 여부, 삭제

  ,HomePubPhotoCount    int not null default '5' -- 삭제
  ,HomeBoxPhotoCount    int not null default '5' -- 삭제
  ,HomeBoxPhotoFeaturedOn char(1) not null default 'N' -- 삭제
  ,HomeNoteOn         char(1) not null default 'Y' -- 삭제
  
  ,BoxUsedSize  bigint not null default 0 -- 개인용량 사용량, 삭제
  ,BoxSID   nvarchar(16) not null default '' --> home, homel
  ,BoxDesc  nvarchar(32) not null default '' --> AKI's home 등, 삭제

  ,NickName nvarchar(32) not null -- AKI
  ,RealName nvarchar(32) not null -- 박규현 -- 삭제
  ,Password nvarchar(16) not null
  ,Email    nvarchar(64) not null
  ,HomePage varchar(256) not null default '' -- 삭제

  ,Tel    varchar(32) not null -- 삭제
  ,Address  nvarchar(64) not null -- 삭제
  ,ZipCode  char(6) not null -- 삭제
  
  ,Comment  ntext not null제 --> profile
  
  ,Greeting ntext not null default '' -- 삭제
  ,Profile  ntext not null default '' -- 삭제
  ,Career   ntext not null default '' -- 삭제
  
  ,primary key (UserID)

-----

table UserFavs (
  OwnerUserID   int not null
  ,TargetUserID int not null
  ,primary key (OwnerUserID, TargetUserID)

-----

*/