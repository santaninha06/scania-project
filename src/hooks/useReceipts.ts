import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  analyzeReceipt,
  createReceiptRecord,
  deleteReceipt,
  getImageUrl,
  getReceipt,
  listReceipts,
  updateReceipt,
  uploadReceiptImage,
} from '@/services/receipts';
import type { Receipt, ReceiptUpdate } from '@/types';
export function useReceipts() {
  return useQuery({ queryKey: ['receipts', 'list'], queryFn: listReceipts });
}
export function useReceipt(id: string | undefined) {
  return useQuery({
    queryKey: ['receipts', 'detail', id],
    queryFn: () => getReceipt(id as string),
    enabled: !!id,
  });
}
export function useReceiptImageUrl(path: string | undefined) {
  return useQuery({
    queryKey: ['receipts', 'image', path],
    queryFn: () => getImageUrl(path as string),
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
  });
}
export type ScanStep = 'upload' | 'analyze';
export function useScanReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      userId: string;
      base64: string;
      onStep: (s: ScanStep) => void;
    }) => {
      v.onStep('upload');
      const path = await uploadReceiptImage(v.userId, v.base64);
      const id = await createReceiptRecord(path);
      try {
        v.onStep('analyze');
        await analyzeReceipt(id);
        return { id, error: null as string | null };
      } catch (e) {
        return { id, error: e instanceof Error ? e.message : 'Falha na leitura' };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receipts'] }),
  });
}
export function useUpdateReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReceiptUpdate }) =>
      updateReceipt(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receipts'] }),
  });
}
export function useDeleteReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (r: Pick<Receipt, 'id' | 'image_path'>) => deleteReceipt(r),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receipts'] }),
  });
}
