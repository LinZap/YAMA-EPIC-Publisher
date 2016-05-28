alter table member alter column name type varchar(32);
update entity set cname='專輯',ename='Album' where eid=1;
update entity set cname='演唱',ename='Singer' where eid=2;
update entity set cname='音樂',ename='Music' where eid=3;
update entity set cname='任務-依時間排列',ename='Task-OrderByDate' where eid=4;
update entity set cname='任務-專輯頁面',ename='Task-AlbumPage' where eid=5;
create index object_ename on object(ename);
cluster object using object_ename;

CREATE OR REPLACE FUNCTION insertclass(_pcid integer,_type integer,_cname character varying,_cdes character varying)
  RETURNS integer AS
$BODY$
declare _cid int; _namepath varchar; _idpath varchar;
begin
	insert into class(Type,CName,Cdes) values(_type,_cname,_cdes) returning cid into _cid;
	if(_pcid is not null) then
		insert into inheritance(pcid,ccid) values(_pcid,_cid);
		select namepath from class where cid = _pcid into _namepath;
		select idpath from class where cid = _pcid into _idpath;
		update class set namepath = _namepath||'/'||_cname,idpath = _idpath||'/'||_cid where cid = _cid;  	
	else 
		select namepath from class where cid = _cid into _namepath;
		select idpath from class where cid = _cid into _idpath;
		update class set namepath = _cname,idpath = _cid where cid = _cid;
	end if;
	return _cid;
end;
$BODY$
  LANGUAGE plpgsql;
  
  
create table Album
(
	AID int not null,
	HASH varchar(32) not null UNIQUE,
	OwnerMID int default 1 references Member(MID),
	primary key (AID),
	foreign key (AID) references Class(CID)
);
CREATE INDEX Album_PK ON Album(AID);
CLUSTER  Album using Album_PK;

create table Music
(
	MID int not null,
	HASH varchar(32) not null UNIQUE,
	primary key (MID),
	foreign key (MID) references Object(OID)
);
CREATE INDEX Music_PK ON Music(MID);
CLUSTER  Music using Music_PK;

create table Task
(
	TID serial not null,
	Type int not null,
	CMD varchar unique not null,
	peding int default 0,
	Since timestamp with time zone not null default(now()),
	DoneDT timestamp with time zone,
	Status boolean not null default false,
	primary key (TID)
);
CREATE INDEX Task_CMD ON  Task(CMD);
CLUSTER  Task using Task_CMD ;

CREATE OR REPLACE FUNCTION insertTask (_type int,_cmd varchar,_pending int default 0)
RETURNS integer AS $$
begin
	if not exists(select * from task where cmd=_cmd and type=_type) then
		insert into task(type,cmd,peding) values(_type,_cmd,_pending);
		return 1;
	end if;
	return 0;
end;
$$ LANGUAGE plpgsql;

select insertTask(4,'https://mojim.com/twzlistALLTime.htm',1);

CREATE OR REPLACE FUNCTION insertAlbum(_AlbumName varchar,_Singer varchar,_AlbumURL varchar,_SingerURL varchar)
RETURNS integer AS $$
declare _hashAlbum varchar(32);_hashSinger varchar(32);_mid int;_aid int;
begin
	if _AlbumURL is null or _SingerURL is null then 
		return null;
	end if;

	_hashAlbum:=md5(_AlbumURL);
	_hashSinger:=md5(_SingerURL);
	select mid from member where name=_hashSinger into _mid;
	if _mid is null then
		insert into object(type,cname,ename,cdes) values(2,_Singer,filter_title(_Singer),_SingerURL) returning oid into _mid;
		insert into member(mid,name) values(_mid,_hashSinger);
	end if;
	select aid from album where HASH=_hashAlbum into _aid;
	if _aid is null then
		select insertclass(1,1,_AlbumName,_AlbumURL) into _aid;
		insert into Album(AID,HASH,Ownermid) values(_aid,_hashAlbum,_mid);
	end if;
	return _aid;
end;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insertMusic(_AlbumURL varchar,_song varchar,_songURL varchar)
RETURNS integer AS $$
declare _hashSong varchar(32);_hashAlbum varchar(32);_musicid int;_mid int;_aid int;
begin
	_hashAlbum:=md5(_AlbumURL);
	select aid,ownermid from album where hash=_hashAlbum into _aid,_mid;
	if _songURL is null or _mid is null then 
		return null;
	end if;
	_hashSong:=md5(_songURL);
	select mid from music where hash=_hashSong into _musicid;
	if _musicid is null then
		insert into object(type,cname,ename,cdes,ownermid) values(3,_song,filter_title(_song),_songURL,_mid) returning oid into _musicid;
		insert into Music(mid,hash) values(_musicid,_hashSong);
		insert into co(cid,oid) values(_aid,_musicid);
	end if;
	return _musicid;
end;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION filter_title(_title character varying)
  RETURNS character varying AS
$BODY$
declare _res varchar:='';_arr varchar[];
begin
	select array_agg(a.t)::varchar[]
	from (select t from (
			select lower(trim(unnest(regexp_matches(_title
			,'([0-9A-Za-z]+)|([\u4e00-\u9fa5\x3130-\x318F\u3041-\u309F\u30A1-\u30FF\u31F0-\u31FF]+)|([\uFF41-\uFF5A\uFF21-\uFF3A]+)','g')))) as t
		) r where t <> ''
	) a into _arr;
	
	if array_length(_arr,1)>0 then
		select array_to_string(_arr,' ') into _res;
	end if;
	
	return  _res;
end;
$BODY$
  LANGUAGE plpgsql;