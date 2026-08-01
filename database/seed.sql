-- =========================================
-- BLOOM FLORISTERÍA
-- Datos iniciales
-- =========================================



-- CATEGORÍAS INICIALES

INSERT INTO categorias
(nombre, descripcion)
VALUES

(
'Ramos',
'Arreglos florales clásicos y personalizados'
),

(
'Arreglos',
'Diseños florales especiales para ocasiones importantes'
),

(
'Regalos',
'Detalles con flores y complementos'
),

(
'Temporada',
'Colecciones especiales de fechas importantes'
);





-- USUARIO ADMINISTRADOR INICIAL

INSERT INTO usuarios
(nombre, correo, password, rol)
VALUES

(
'Administrador Bloom',
'admin@bloom.com',
'bloom123',
'Administrador'
);





-- CONFIGURACIÓN INICIAL

INSERT INTO configuracion
(nombre_tienda, whatsapp, instagram, direccion, horario)
VALUES

(
'Bloom',
'',
'@bloomfloristeria.gt',
'',
'Lunes a sábado 9:00 AM - 6:00 PM'
);