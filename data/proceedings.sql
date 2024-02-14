
DROP TABLE IF EXISTS zr_sec_doc_rule;
DROP TABLE IF EXISTS zr_sec_doc;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS soes;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS document;


-- proceedings.document definition
CREATE TABLE document (
  id int(11) NOT NULL AUTO_INCREMENT,
  code varchar(4),
  name varchar(255),
  description varchar(255),
  status int(11),
  format varchar(255),
  required int(11),
  limit_mb int(11),
  docwkf int(11),
  tipo int(11),
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  id_sub int(11),
  PRIMARY KEY (id)
) ENGINE=InnoDB ;


-- proceedings.products definition
CREATE TABLE products (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255),
  description varchar(255),
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- proceedings.soes definition
CREATE TABLE soes (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255),
  description varchar(255),
  code varchar(16),
  xyear varchar(6),
  version varchar(16),
  id_product int(11),
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  KEY id_product (id_product),
  CONSTRAINT soes_ibfk_1 FOREIGN KEY (id_product) REFERENCES products (id)
) ENGINE=InnoDB;

-- proceedings.sections definition
CREATE TABLE sections (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255),
  description varchar(255),
  id_soe int(11),
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  KEY id_soe (id_soe),
  CONSTRAINT sections_ibfk_1 FOREIGN KEY (id_soe) REFERENCES soes (id)
) ENGINE=InnoDB ;


-- proceedings.documento en sections definition
CREATE TABLE zr_sec_doc (
  id int(11) NOT NULL AUTO_INCREMENT,
  id_doc int(11),
  id_sec int(11),
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  KEY id_doc (id_doc),
  KEY id_sec (id_sec),
  CONSTRAINT doc_ibfk_1 FOREIGN KEY (id_doc) REFERENCES document (id),
  CONSTRAINT sections_ibfk_2 FOREIGN KEY (id_sec) REFERENCES sections (id)
) ENGINE=InnoDB ;


-- proceedings.zr_sec_doc_rule definition
CREATE TABLE zr_sec_doc_rule  (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255),
  description varchar(255),
  id_zr_sd int(11), -- regla seccion y documento
  fecha timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  KEY id_zr_sd (id_zr_sd),
  CONSTRAINT zr_sec_doc_ibfk_1 FOREIGN KEY (id_zr_sd) REFERENCES zr_sec_doc (id)
) ENGINE=InnoDB ;


DROP TABLE IF EXISTS SEC_012_Enlaces_Archivos;

CREATE TABLE SEC_012_Enlaces_Archivos (
  id int(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  hash varchar(128) NOT NULL,
  ruta text DEFAULT NULL,
  nomb text DEFAULT NULL,
  tipo varchar(256) DEFAULT NULL,
  code varchar(256) DEFAULT NULL,
  docu varchar(256) DEFAULT NULL,
  vers varchar(64) DEFAULT NULL,
  deta varchar(64) DEFAULT NULL,
  fech date NOT NULL,
  peso varchar(64) DEFAULT NULL,
  rif varchar(256) DEFAULT NULL,
  create_at timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Fecha de creacion',
  secc text DEFAULT NULL,
  esta  int(11) NOT NULL DEFAULT 0,
  view int(11) NOT NULL DEFAULT 0,
  KEY xhash (hash),
  INDEX xdoc (docu),
  FULLTEXT KEY `xnomb` (`ruta`,`nomb`,`secc`)
) ENGINE=InnoDB;


DROP TABLE IF EXISTS SEC_012_Zr_Enlaces_Archivos;
CREATE TABLE SEC_012_Zr_Enlaces_Archivos (
  id int(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  hash varchar(128) NOT NULL,
  ruta text DEFAULT NULL,
  nomb text DEFAULT NULL,
  code varchar(256) DEFAULT NULL,
  docu varchar(256) DEFAULT NULL,
  rif varchar(256) DEFAULT NULL,
  KEY shash (hash),
  INDEX sdoc (docu)
) ENGINE=InnoDB;


