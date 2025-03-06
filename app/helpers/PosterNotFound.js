/**
 *Returns a link to the image of the Placeholder.
 *
 *@param {String} Size -image size. You can specify the size of the square (for example, '100') or a rectangle (for example, '100x500').
 *@param {String} Text, which will be displayed in the image.
 *@returns {string} Link to the image.
 */
function getDefoultPosterLink(size = '500', text = 'NO POSTER') {
  return `https://placehold.co/${size}?text=${text.split(' ').join('+')}`;
}

export default getDefoultPosterLink;
