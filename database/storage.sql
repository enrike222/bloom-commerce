-- =========================================
-- BLOOM FLORISTERÍA
-- Almacenamiento de imágenes
-- =========================================


-- BUCKET PARA IMÁGENES DE PRODUCTOS

INSERT INTO storage.buckets
(id, name, public)

VALUES

(
'productos',
'productos',
true
);



-- POLÍTICA PARA VER IMÁGENES PÚBLICAS

CREATE POLICY "Imágenes públicas de productos"

ON storage.objects

FOR SELECT

USING (

bucket_id = 'productos'

);



-- POLÍTICA PARA SUBIR IMÁGENES

CREATE POLICY "Permitir subida de imágenes"

ON storage.objects

FOR INSERT

WITH CHECK (

bucket_id = 'productos'

);