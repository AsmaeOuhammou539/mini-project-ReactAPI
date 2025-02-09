import React from 'react';

function Ajouter() {
  return (
    <div className='Ajouter'> 
      <header>
        <h1>ReVendre</h1>
        <div>
          <img src="icons/leave.png" alt="" />
          <p>Quitter</p>
        </div>
      </header>
      <form>
        <div className="form-columns">
          <div className="form-left">
            <label htmlFor="Catégorie">Catégorie:</label>
            <select name="Catégorie" id="Catégorie">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" />

            <label htmlFor="description">Description:</label>
            <textarea name="description" id="description"></textarea>
          </div>

          <div className="form-right">
            <label htmlFor="price">Price:</label>
            <input type="text" id="price" />

            <label htmlFor="tel">Numéro de téléphone:</label>
            <input type="text" id="tel" />

            <label htmlFor="ville">Ville:</label>
            <input type="text" id="ville" />

            <label htmlFor="image">Image de produit:</label>
            <input type="file" id="image" />
          </div>
        </div>

        <button>
          <img src="icons/share.png" alt="" />
          Déposer
        </button>
      </form>
    </div>
  );
}

export default Ajouter;