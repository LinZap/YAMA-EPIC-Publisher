create table Entity
(
	EID serial not null,
	CName varchar(50) not null,
	EName varchar(50) not null,
  	primary key (EID)
);
CREATE INDEX Entity_PK ON Entity(EID);
CLUSTER  Entity using Entity_PK;

create table Object
(
	OID serial not null,
	Type smallint not null,
	CName varchar(450) null,
	CDes varchar(800) null,
	EName varchar(800) null,
	EDes varchar(800) null,
	Since timestamp not null default(now()),
	LastModifyDT timestamp not null default(now()),
	OwnerMID int null,
	primary key (OID)
);

CREATE INDEX Object_PK ON Object(OID);
CLUSTER  Object using Object_PK;

create table Class
(
	CID serial not null,
	Type smallint null references Entity(EID),
	CName varchar(255) null default(''),
	CDes varchar(4000) null default(''),
	EName varchar(255) null default(''),
	EDes varchar(800) null default(''),
	IDPath varchar(255) null,
	NamePath varchar(900) null,
	Since timestamp null default(now()),
	LastModifyDT timestamp null default(now()),
 	primary key  (CID),
 	UNIQUE(IDPath,NamePath)
);

CREATE INDEX Class_PK ON Class(CID);
CLUSTER  Class using Class_PK;

create table Inheritance
(
	PCID int not null references Class(CID),
	CCID int not null references Class(CID),
	primary key  (PCID, CCID)
);
CREATE INDEX Inheritance_PK ON Inheritance(PCID, CCID);
CLUSTER  Inheritance using Inheritance_PK;

create table CO
(
	CID int not null references Class(CID),
	OID int not null references Object(OID),
	primary key (CID, OID)
);
CREATE INDEX CO_PK ON CO(CID, OID);
CLUSTER  CO using CO_PK;


create table Member
(
	MID int not null,
	Name varchar(30) not null UNIQUE,
	primary key (MID),
	foreign key (MID) references Object(OID)
);
CREATE INDEX Member_PK ON Member(MID);
CLUSTER  Member using Member_PK;

-- i3S Portal Dafault Data
insert into Entity(CName,EName) values('WEB資源','URL');
insert into Entity(CName,EName) values('會員','Member');
insert into Entity(CName,EName) values('檔案','Archive');
insert into Entity(CName,EName) values('通用公告','Post');
insert into Entity(CName,EName) values('其他','Other');
-- CLayout
insert into Class(Type,CName,CDes,EName,EDes,IDPath,NamePath) 
values(null,'首頁','',null,null,'1','首頁');