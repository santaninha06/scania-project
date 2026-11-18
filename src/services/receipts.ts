import { FunctionsHttpError } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import type { Receipt, ReceiptUpdate } from '@/types';
const BUCKET = 'receipts';
export async function listReceipts(): Promise<Receipt[]> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Receipt[];
}
export async function getReceipt(id: string): Promise<Receipt> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*, items:receipt_items(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Receipt;
}
export async function uploadReceiptImage(
  userId: string,
  base64: string,
): Promise<string> {
  const suffix = Math.random().toString(36).slice(2, 8),
    path = `${userId}/${Date.now()}-${suffix}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, decode(base64), { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}
export async function createReceiptRecord(image_path: string) {
  const { data, error } = await supabase
    .from('receipts')
    .insert({ image_path })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}
export async function analyzeReceipt(receiptId: string) {
  const { error } = await supabase.functions.invoke('scan-receipt', {
    body: { receipt_id: receiptId },
  });
  if (!error) return;
  let message = error.message;
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch {}
  }
  throw new Error(message);
}
export async function updateReceipt(id: string, input: ReceiptUpdate) {
  const { error } = await supabase
    .from('receipts')
    .update({ ...input, status: 'done', error_message: null })
    .eq('id', id);
  if (error) throw error;
}
export async function deleteReceipt(r: Pick<Receipt, 'id' | 'image_path'>) {
  const removed = await supabase.storage.from(BUCKET).remove([r.image_path]);
  if (removed.error) throw removed.error;
  const { error } = await supabase.from('receipts').delete().eq('id', r.id);
  if (error) throw error;
}
export async function getImageUrl(path: string) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}
