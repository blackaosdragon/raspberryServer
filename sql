CREATE TABLE `test`.`Valores` ( `registro` INT NOT NULL AUTO_INCREMENT , `lugar` VARCHAR(50) NOT NULL , `valor` FLOAT(5) NOT NULL , `fecha` TIMESTAMP NOT NULL , PRIMARY KEY (`registro`)) ENGINE = InnoDB;
INSERT INTO `Valores` (`registro`, `lugar`, `valor`, `fecha`) VALUES (NULL, 'Oficina', '5.6', CURRENT_TIMESTAMP);
Listar los nombres de una tabla
-  SELECT column_name FROM information_schema.columns WHERE table_name="Registro";
-  SELECT clomun_name FROM information_schema.columns WHERE table_name="Nombre_de_tu_tabla";

SELECT table_schema, TABLE_NAME, ROUND(((data_length + index_length) / 1024 / 1024), 2) `Tamaño(MB)`  FROM information_schema.TABLES WHERE TABLE_NAME='Registro';
SELECT DISTINCT (extract(year FROM fecha)) AS año FROM Registro;
Obtener los dias
-  SELECT DISTINCT (extract(day FROM fecha)) AS dia FROM monitoreo.Registro WHERE fecha>= '2020-05-01' AND fecha<'2020-05-31';
-  SELECT DISTINCT ubicacion AS lugar FROM monitoreo.Registro;

Crear Tabla nueva 
 - CREATE TABLE `test`.`pruebaFechas` ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , `ID` INT NOT NULL AUTO_INCREMENT ) `Mes` INT(2) NOT NULL
 - CREATE TABLE `test`.`pruebaFechas` ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , `ID` INT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;
 - CREATE TABLE monitoreo.Bitacora ( `Lugar` VARCHAR(30) NOT NULL , `Temperatura` FLOAT(6) NOT NULL , `Dia` INT(2) NOT NULL , `Mes` INT(2) NOT NULL , `Año` INT(4) NOT NULL , `Hora` INT(2) NOT NULL , `Minuto` INT(2) NOT NULL , `Segundo` INT(2) NOT NULL , `ID` INT NOT NULL);

 `Ubicacion` VARCHAR(30) NOT NULL , `Marca` VARCHAR(30) NULL , `Modelo` VARCHAR(30) NULL , `Serie` VARCHAR(30) NULL , `Inventario` VARCHAR(30) NULL , 
 INSERT INTO monitoreo.Bitacora(Lugar, Temperatura, Dia, Mes, Año, Hora, Minuto, Segundo,ID) VALUES ("oficina",21.5,26,06,2020,9,40,0,2);


 Insertar Data
 - INSERT INTO `pruebaFechas`(`Lugar`, `Temperatura`, `Dia`, `Mes`, `Año`, `Hora`, `Minuto`, `Segundo`, `Ubicacion`, `Marca`, `Modelo`, `Serie`, `Inventario`) VALUES ("oficina",21.5,25,06,2020,11,10,0,"Plata Baja","Sin marca",NULL,"101010","imss2020pbST1")

Otorgar Permisos
 - GRANT SELECT on monitoreo.test to 'infoUpdater'@'localhost';

MOstrar todas las tablas de un base de datos
 - SHOW FULL TABLES from base_De_Datos;





SELECT EXTRACT(year FROM fecha) year FROM monitoreo.Registro;

SELECT EXTRACT(year FROM fecha) year FROM Registro;
SELECT fecha as año WHERE 
SELECT count(distinct year) from Registro;
SELECT count(distinct fecha) from Registro;
SELECT EXTRACT(year FROM fecha) 
SELECT COUNT (DISTINCT fecha) FROM Registro;
SELECT COUNT(DISTINCT (EXTRACT (year FROM fecha))) FROM Registro;


SELECT * FROM monitoreo.Bitacora 
WHERE 
año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND 
Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND 
Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

SELECT * FROM monitoreo.Bitacora WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

SELECT * FROM monitoreo.Bitacora 
  WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND
  Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) and 
  Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
  Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
  Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;
  Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE id=1));

  SELECT * FROM monitoreo.Bitacora WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) and Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND Minuto=(SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1;

  SELECT * FROM monitoreo.Bitacora 
    WHERE año=(SELECT MAX(Año) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Mes=(SELECT MAX(Mes) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Dia=(SELECT MAX(Dia) FROM monitoreo.Bitacora WHERE ID=1) AND 
    Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1) AND 
      Minuto=
      (SELECT MAX(Minuto) FROM monitoreo.Bitacora WHERE ID=1 AND Hora=(SELECT MAX(Hora) FROM monitoreo.Bitacora WHERE ID=1));
