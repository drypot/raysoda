/* TODO

table BBSFolders (
  FolderID int not null
  ,OwnerType char(1) not null -- A:공공게시판, U:개인게시판, B:겔러리(box)게시판
  ,OwnerID int not null
  ,SortValue int not null
  ,SampleDay int not null
  ,SampleMin int not null
  ,ATTE char(1) not null
  ,ATTR char(1) not null
  ,ATTM char(1) not null
  ,ATTO char(1) not null
  ,DisGuestNew char(1) not null
  ,DisGuestReply char(1) not null
  ,Hidden char(1) not null
  ,Photo char(1) not null
  ,Title nvarchar(128) not null
  ,primary key nonclustered (FolderID)
)
go

create clustered index cidx on BBSFolders(OwnerType,OwnerID,SortValue,Hidden)

table BBSThreads (
  ThreadID int not null
  ,UserID int not null default 0
  ,FolderID int not null
  ,Hit int not null default 0
  ,CDate datetime not null default getdate()
  ,UDate datetime not null default getdate()
  ,Lock char(1) not null default 'N'
  ,Hidden char(1) not null default 'N'
  ,Title nvarchar (128) not null
  ,primary key (ThreadID)
)
go

create index idx1 on BBSThreads(FolderID, CDate desc)
create index idx2 on BBSThreads(FolderID, UDate desc)

table BBSArticles (
  ArticleID int not null
  ,ThreadID int not null
  ,UserID int null
  ,CDate datetime not null default getdate()
  ,Music varchar(1024) default ''
  ,[Text] ntext not null
  ,primary key (ArticleID)
) 
GO

create index IThreadCDate on BBSArticles(ThreadID, CDate)
create index UserIDThreadIDIdx on BBSArticles(UserID, ThreadID)

table BBSThreadsPhotos
go
create table BBSThreadsPhotos(
  ThreadID int not null
  ,PhotoID int not null
  ,primary key(ThreadID)
)
go

create index IPhotoID on BBSThreadsPhotos(PhotoID)

table BBSUsersThreads
go
create table BBSUsersThreads (
  UserID int not null
  ,ThreadID int not null
  ,primary key (UserID, ThreadID)
)

create index idx1 on BBSUsersThreads(ThreadID);

view BBSUsersThreadsSorted with schemabinding
as
select UT.UserID, UT.ThreadID, T.UDate
from dbo.BBSUsersThreads UT join dbo.BBSThreads T on UT.ThreadID = T.ThreadID
go

create unique clustered index idx on BBSUsersThreadsSorted(UserID, UDate desc);

*/
