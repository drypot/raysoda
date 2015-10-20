/* TODO

table BoxPhotos (
  PhotoID int not null
  ,UserID int not null
  ,CDate datetime not null default getdate()
  ,UDate datetime not null default getdate() -- 삭제 고려
  ,Hit int not null default 0 -- 삭제 고려
  ,Border tinyint not null default 1

  ,Title nvarchar(128) not null -- 삭제 고려
  ,Music varchar(1024) not null default '' -- 삭제
  ,Comment ntext not null
  ,primary key (PhotoID)
)

create index idx1 on BoxPhotos(UserID, CDate);
create index idx2 on BoxPhotos(UserID, UDate);
create index idx3 on BoxPhotos(CDate);

-----

table BoxFolderComments (
  CommentID int not null
  ,FolderID int not null
  ,UserID int not null
  ,CDate datetime not null default getdate()
  ,Comment nvarchar(4000) not null default ''
  ,primary key nonclustered (CommentID)
) -- 삭제

-----

table BoxFolders (
  FolderID  int not null
  ,UserID   int not null
  ,CDate    datetime not null default getdate()
  ,UDate    datetime not null default getdate() -- 삭제 대상
  ,Hit    int not null default 0 -- 삭제
  ,SortKey  char(1) not null
  ,SortDir  char(1) not null
  ,Func   char(1) not null
  ,FHidden  char(1) not null
  ,SortValue  int not null
  ,ThumbCount int not null
  ,Title    nvarchar(128) not null
  ,Music    varchar(1024) -- 삭제
  ,Comment  ntext not null -- 삭제
  ,Note ntext not null -- ???
  ,primary key (FolderID)
)

create index idx3 on BoxFolders(UserID,Func,UDate);
create index idx5 on BoxFolders(UserID,Func,SortValue,FolderID);

-----

table BoxFrontFolders (
  UserID    int not null
  ,FolderID int not null
  ,CDate    datetime not null default getdate()
  ,[Count]  int not null
  ,primary key (UserID, FolderID)
) -- 삭제

-----

table BoxFoldersPhotos (
  FolderID  int not null
  ,PhotoID  int not null
  ,SortValue  int not null
  ,primary key (FolderID, PhotoID)
) -- BoxPhotos 로 머지
go

create index idx1 on BoxFoldersPhotos(PhotoID, FolderID);
create index idx2 on BoxFoldersPhotos(FolderID, SortValue, PhotoID);

-----

table BoxPhotoComments (
  CommentID int not null
  ,PhotoID int not null
  ,UserID int not null
  ,CDate datetime not null default getdate()
  ,GuestName nvarchar(16) not null default '' -- 삭제
  ,GuestPassword nvarchar(16) not null default '' -- 삭제
  ,Comment nvarchar(4000) not null default ''
  ,primary key nonclustered (CommentID)
)

Guest 데이터 처리 고민

create clustered index idx1 on BoxPhotoComments(PhotoID, CDate)

*/
