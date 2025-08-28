-- CreateTable
CREATE TABLE `ActEspecifica` (
    `nact_especifica` VARCHAR(191) NOT NULL,
    `idact_especifica` INTEGER NULL,

    PRIMARY KEY (`nact_especifica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CajaAnual` (
    `nro` INTEGER NULL,
    `codcaja_a` VARCHAR(191) NOT NULL,
    `fecha_apertura` DATETIME(3) NULL,
    `monto_inicial_a` DOUBLE NULL,
    `ingreso_a` DOUBLE NULL,
    `salida_a` DOUBLE NULL,
    `saldo_a` DOUBLE NULL,
    `fechacierre` DATETIME(3) NULL,
    `registra` VARCHAR(191) NULL,
    `estado_c_a` VARCHAR(191) NULL,

    PRIMARY KEY (`codcaja_a`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CajaMes` (
    `nro` INTEGER NULL,
    `codcaja_m` VARCHAR(191) NOT NULL,
    `fecha_apertura` DATETIME(3) NULL,
    `monto_inicial_m` DOUBLE NULL,
    `ingreso_mes` DOUBLE NULL,
    `salida_mes` DOUBLE NULL,
    `saldo_mes` DOUBLE NULL,
    `fechacierre` DATETIME(3) NULL,
    `codcaja_a` VARCHAR(191) NOT NULL,
    `registra` VARCHAR(191) NULL,
    `estado_c_m` VARCHAR(191) NULL,

    PRIMARY KEY (`codcaja_m`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClienteProv` (
    `nro` INTEGER NULL,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `nregimen` VARCHAR(191) NULL,
    `razonsocial` VARCHAR(85) NULL,
    `u_digito` CHAR(2) NULL,
    `ruc` VARCHAR(11) NULL,
    `c_usuario` VARCHAR(20) NULL,
    `c_passw` VARCHAR(45) NULL,
    `dni` VARCHAR(8) NULL,
    `cod_envio` VARCHAR(191) NULL,
    `pdt_621` CHAR(2) NULL,
    `planilla_elect` CHAR(2) NULL,
    `fact_elect` CHAR(2) NULL,
    `libro_elect` CHAR(2) NULL,
    `tipo_cronog` CHAR(2) NULL,
    `ple_desde` DATE NULL,
    `cta_detraccion` VARCHAR(191) NULL,
    `paga_detraccion` CHAR(2) NULL,
    `paga_percepcion` CHAR(2) NULL,
    `compensa_percepcion` CHAR(2) NULL,
    `sujeta_retencion` CHAR(2) NULL,
    `clave_afpnet` VARCHAR(191) NULL,
    `clave_rnp` CHAR(2) NULL,
    `nrubro` VARCHAR(191) NULL,
    `nact_especifica` VARCHAR(191) NULL,
    `fecha_ingreso` DATE NULL,
    `contacto` VARCHAR(191) NULL,
    `telefono` INTEGER NULL,
    `direccion` VARCHAR(191) NULL,
    `responsable` VARCHAR(191) NULL,
    `montoref` DOUBLE NULL,
    `honorario_anual` VARCHAR(191) NULL,
    `obs` VARCHAR(191) NULL,
    `idfacturador` INTEGER NOT NULL,
    `f_usuario` VARCHAR(191) NOT NULL,
    `f_pass` VARCHAR(50) NOT NULL,
    `estado` CHAR(2) NOT NULL,
    `declarado` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`idclienteprov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Concepto` (
    `idconcepto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_concepto` VARCHAR(191) NULL,

    PRIMARY KEY (`idconcepto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configuracion` (
    `idconfig` INTEGER NOT NULL AUTO_INCREMENT,
    `e_razonsocial` VARCHAR(191) NULL,
    `e_ncomercial` VARCHAR(191) NULL,
    `igv` DOUBLE NULL,
    `tim` DOUBLE NULL,
    `e_ruc` VARCHAR(191) NULL,

    PRIMARY KEY (`idconfig`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado` (
    `idestado` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_estado` VARCHAR(191) NULL,

    PRIMARY KEY (`idestado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facturador` (
    `idfacturador` INTEGER NOT NULL AUTO_INCREMENT,
    `n_facturador` VARCHAR(191) NULL,
    `f_obs` VARCHAR(191) NULL,

    PRIMARY KEY (`idfacturador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormaPagoTrib` (
    `idforma_pago_trib` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`idforma_pago_trib`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingreso` (
    `idingreso` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NULL,
    `idtipo_op` INTEGER NULL,
    `idtipo_doc` INTEGER NULL,
    `serie_doc` INTEGER NULL,
    `num_doc` INTEGER NULL,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `idconcepto` INTEGER NOT NULL,
    `idperiodo` INTEGER NOT NULL,
    `anio` INTEGER NULL,
    `importe` DOUBLE NULL,
    `idestado` INTEGER NULL,
    `observacion` VARCHAR(191) NULL,
    `registra` VARCHAR(191) NULL,
    `codcaja_m` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idingreso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notas` (
    `idnotas` INTEGER NOT NULL AUTO_INCREMENT,
    `n_fecha` DATE NULL,
    `idclienteprov` CHAR(5) NULL,
    `contenido` TEXT NULL,
    `fecha_ed` DATE NOT NULL,
    `ncreador` VARCHAR(191) NULL,
    `neditor` VARCHAR(191) NULL,

    PRIMARY KEY (`idnotas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagos` (
    `idpagos` INTEGER NOT NULL AUTO_INCREMENT,
    `idtributos` INTEGER NOT NULL,
    `fecha_p` DATE NULL,
    `importe_p` DOUBLE NOT NULL,
    `idforma_pago_trib` VARCHAR(191) NOT NULL,
    `detalles` VARCHAR(191) NULL,

    PRIMARY KEY (`idpagos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Periodo` (
    `idperiodo` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_periodo` VARCHAR(191) NULL,

    PRIMARY KEY (`idperiodo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personal` (
    `id_personal` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NULL,
    `apellidos` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NULL,
    `telefono` CHAR(9) NULL,
    `personalcol` VARCHAR(191) NULL,

    PRIMARY KEY (`id_personal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Regimen` (
    `nregimen` VARCHAR(191) NOT NULL,
    `idregimen` INTEGER NULL,

    PRIMARY KEY (`nregimen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rubro` (
    `nrubro` VARCHAR(191) NOT NULL,
    `idrubro` INTEGER NULL,

    PRIMARY KEY (`nrubro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salida` (
    `idsalida` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NULL,
    `idtipo_op` INTEGER NULL,
    `idtipo_doc` INTEGER NULL,
    `serie_doc` INTEGER NULL,
    `num_doc` INTEGER NULL,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `idconcepto` INTEGER NOT NULL,
    `idperiodo` INTEGER NOT NULL,
    `anio` INTEGER NULL,
    `importe` DOUBLE NULL,
    `idestado` INTEGER NULL,
    `observacion` VARCHAR(191) NULL,
    `registra` VARCHAR(191) NULL,
    `codcaja_m` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idsalida`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDocumento` (
    `idtipo_doc` INTEGER NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`idtipo_doc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoOperacion` (
    `idtipo_op` INTEGER NOT NULL,
    `nombre_op` VARCHAR(191) NULL,

    PRIMARY KEY (`idtipo_op`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTrib` (
    `idtipo_trib` VARCHAR(191) NOT NULL,
    `descripcion_t` VARCHAR(191) NULL,

    PRIMARY KEY (`idtipo_trib`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoUsuario` (
    `id_tipo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id_tipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tmp` (
    `idtmp` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_p` DATE NOT NULL,
    `importe_p` DOUBLE NOT NULL,
    `idforma_pago_trib` VARCHAR(191) NULL,
    `detalles` VARCHAR(191) NULL,
    `session_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idtmp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tributos` (
    `idtributos` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_v` DATE NOT NULL,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `anio` CHAR(4) NULL,
    `mes` CHAR(2) NULL,
    `idtipo_trib` VARCHAR(191) NOT NULL,
    `importe_reg` DOUBLE NULL,
    `importe_pc` INTEGER NULL,
    `importe_pend` INTEGER NULL,
    `importe_pag` DOUBLE NULL,
    `estado` CHAR(1) NOT NULL,
    `obs` VARCHAR(191) NULL,
    `fecha_reg` DATE NULL,

    PRIMARY KEY (`idtributos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `id_personal` INTEGER NOT NULL,
    `id_tipo` INTEGER NOT NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vencimientos` (
    `idvencimientos` INTEGER NOT NULL AUTO_INCREMENT,
    `d0` DATE NOT NULL,
    `d1` DATE NOT NULL,
    `d2` DATE NOT NULL,
    `d3` DATE NOT NULL,
    `d4` DATE NOT NULL,
    `d5` DATE NOT NULL,
    `d6` DATE NOT NULL,
    `d7` DATE NOT NULL,
    `d8` DATE NOT NULL,
    `d9` DATE NOT NULL,
    `anio_v` CHAR(4) NOT NULL,
    `mes_v` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`idvencimientos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CajaMes` ADD CONSTRAINT `CajaMes_codcaja_a_fkey` FOREIGN KEY (`codcaja_a`) REFERENCES `CajaAnual`(`codcaja_a`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClienteProv` ADD CONSTRAINT `ClienteProv_nregimen_fkey` FOREIGN KEY (`nregimen`) REFERENCES `Regimen`(`nregimen`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClienteProv` ADD CONSTRAINT `ClienteProv_nrubro_fkey` FOREIGN KEY (`nrubro`) REFERENCES `Rubro`(`nrubro`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClienteProv` ADD CONSTRAINT `ClienteProv_idfacturador_fkey` FOREIGN KEY (`idfacturador`) REFERENCES `Facturador`(`idfacturador`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `ClienteProv`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idconcepto_fkey` FOREIGN KEY (`idconcepto`) REFERENCES `Concepto`(`idconcepto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idperiodo_fkey` FOREIGN KEY (`idperiodo`) REFERENCES `Periodo`(`idperiodo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idtipo_doc_fkey` FOREIGN KEY (`idtipo_doc`) REFERENCES `TipoDocumento`(`idtipo_doc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idtipo_op_fkey` FOREIGN KEY (`idtipo_op`) REFERENCES `TipoOperacion`(`idtipo_op`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_idestado_fkey` FOREIGN KEY (`idestado`) REFERENCES `Estado`(`idestado`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingreso` ADD CONSTRAINT `Ingreso_codcaja_m_fkey` FOREIGN KEY (`codcaja_m`) REFERENCES `CajaMes`(`codcaja_m`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `ClienteProv`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idconcepto_fkey` FOREIGN KEY (`idconcepto`) REFERENCES `Concepto`(`idconcepto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idperiodo_fkey` FOREIGN KEY (`idperiodo`) REFERENCES `Periodo`(`idperiodo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idtipo_doc_fkey` FOREIGN KEY (`idtipo_doc`) REFERENCES `TipoDocumento`(`idtipo_doc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idtipo_op_fkey` FOREIGN KEY (`idtipo_op`) REFERENCES `TipoOperacion`(`idtipo_op`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_idestado_fkey` FOREIGN KEY (`idestado`) REFERENCES `Estado`(`idestado`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salida` ADD CONSTRAINT `Salida_codcaja_m_fkey` FOREIGN KEY (`codcaja_m`) REFERENCES `CajaMes`(`codcaja_m`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tributos` ADD CONSTRAINT `Tributos_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `ClienteProv`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tributos` ADD CONSTRAINT `Tributos_idtipo_trib_fkey` FOREIGN KEY (`idtipo_trib`) REFERENCES `TipoTrib`(`idtipo_trib`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_personal_fkey` FOREIGN KEY (`id_personal`) REFERENCES `Personal`(`id_personal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_tipo_fkey` FOREIGN KEY (`id_tipo`) REFERENCES `TipoUsuario`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;
