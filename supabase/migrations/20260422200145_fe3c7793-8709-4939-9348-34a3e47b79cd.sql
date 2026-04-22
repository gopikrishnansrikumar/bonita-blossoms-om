DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Public can view site media" ON storage.objects;

CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND payment_method = 'cash_on_delivery'
  AND order_channel = 'website'
);

CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id
  )
);

CREATE POLICY "Authenticated admins can view site media objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));