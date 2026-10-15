// Interpret saved response codes without rewriting historical deliveries.
export function deliveryReason(code) {
  if (code === 404 || code === 410) return '订阅地址已失效，已自动停用；无需重试。具体失效原因无法由响应码确定。';
  if (code === 401 || code === 403) return '推送服务拒绝认证或授权，请检查 VAPID 配置。';
  if (code === 413) return '通知报文过大，被推送服务拒绝。';
  if (code === 429) return '推送服务限流，请稍后检查再决定是否重试。';
  if (code === 598) return '发送过程发生 TypeError，可能涉及网络或报文处理；具体阶段需查 Worker 日志。';
  if (code === 599) return '发送过程发生内部异常；具体原因需查 Worker 日志。';
  if (code >= 500 && code <= 599) return '推送服务返回服务端错误，请稍后检查。';
  if (code === null || code === 0) return '未记录有效响应码，无法确定具体原因。';
  return '推送服务拒绝请求；仅凭响应码无法确定更具体的原因。';
}

export function summarizeDeliveries(rows) {
  const result = { delivered: 0, expired: 0, failed: 0, pending: 0, reasons: [] };
  for (const row of rows) {
    const count = Number(row.total);
    const code = row.response_status == null ? null : Number(row.response_status);
    if (row.status === 'delivered') result.delivered += count;
    else if (row.status === 'pending' || row.status === 'sending') result.pending += count;
    else if (row.status === 'failed') {
      const category = code === 404 || code === 410 ? 'expired' : 'failed';
      result[category] += count;
      result.reasons.push({ category, code, count, message: deliveryReason(code) });
    }
  }
  return result;
}
