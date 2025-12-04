/**
 * Br19: GetUserChooseInQS()
 * 判斷使用者在快搜中選擇的是電影或影城
 * @param {string} choice - 使用者輸入
 * @returns {string} 'movie' = 選電影, 'cinema' = 選影城, '' = 不合法
 */
export function checkBr19(choice) {
  const lower = choice.toLowerCase();
  if (lower === "電影" || lower === "movie") return "movie";
  if (lower === "影城" || lower === "cinema") return "cinema";
  return "";
}
