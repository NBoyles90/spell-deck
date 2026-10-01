const spells = [
    {
        name: "Fireball",
        type: "fire",
        power: 20,
        mana: 15
    },
    {
        name: "Ice Blast",
        type: "ice",
        power: 15,
        mana: 10
    },
    {
        name: "Lightning",
        type: "electric",
        power: 25,
        mana: 20
    },
    {
        name: "Poison Cloud",
        type: "poison",
        power: 10,
        mana: 5
    },
    {
        name: "Earth Strike",
        type: "earth",
        power: 18,
        mana: 13
    },
    {
        name: "Wind Slash",
        type: "wind",
        power: 12,
        mana: 25,
    }
];
// global variables
const cardsContainer = document.querySelector('.spell-board');
const instructionsContainer = document.querySelector('.instructions');
let castSpell;
const enemyHealthContainer = document.querySelector('.enemy-health');
let enemyHealth = 75;
const manaContainer = document.querySelector('.mana');
let playerMana = 100;
const manaBtn = document.querySelector('.mana-btn');
const potionContainer = document.querySelector('.mana-potion');
const healthPotionContainer = document.querySelector('.health-potion');
const bothPotionContainer = document.querySelector('.potion');
let potionCount = 3;
let healthPotionCount = 3;
const manaPotion = 15;
const maxPlayerMana = 100;
const healthPotion = 25;
const maxPlayerHealth = 100;
let playerHealth = 100;
const playerHealthContainer = document.querySelector('.player-health');
let enemyAttackContainer = document.querySelector('.enemy-attack');
const resetBtn = document.querySelector('.reset');
const healthbtn = document.querySelector('.health-btn');

//Creates the Cards
const fullCardArray = spells.map(function(eachCard){
    const cardHTML = `
    <button class="spell-card" type="button">
        <h2>${eachCard.name}</h2>
        <p>Type: ${eachCard.type}</p>
        <p class="spell-power">Power: ${eachCard.power}</p>
        <p class="mana-cost">Mana Cost: ${eachCard.mana}</p>
    </button>`
    return cardHTML;
});

const joinCardsHTML = fullCardArray.join("");
cardsContainer.innerHTML = joinCardsHTML;
addSpellListeners();


//*** POTION BUTTON LISTENER ***
manaBtn.addEventListener('click', ()=>{
    if (playerMana < maxPlayerMana && potionCount > 0){
        if (playerMana <= maxPlayerMana - manaPotion){
            playerMana += manaPotion;
            manaContainer.textContent = playerMana;
            potionCount--;
            potionContainer.textContent = potionCount;
        }
        else if (playerMana > maxPlayerMana - manaPotion && playerMana < maxPlayerMana){
            playerMana = maxPlayerMana;
            manaContainer.textContent = playerMana;
            potionCount--
            potionContainer.textContent = potionCount;
        }
    } 
    else {
        if (potionCount <= 0){
            instructionsContainer.textContent = "You have no more potions!"
        }
        else {
            instructionsContainer.textContent = "You have the max amount of mana!"
        }        
    }
});

//*** HEALTH POTION LISTENER ***
healthbtn.addEventListener('click', () =>{
    if (playerHealth < maxPlayerHealth && healthPotionCount > 0){
        if (playerHealth <= maxPlayerHealth - healthPotion){
            playerHealth += healthPotion;
            healthPotionCount--;
            playerHealthContainer.textContent = playerHealth;
            healthPotionContainer.textContent = healthPotionCount;
        }
        else {
            playerHealth = 100;
            healthPotionCount--;
            playerHealthContainer.textContent = playerHealth;
            healthPotionContainer.textContent = healthPotionCount;
        }
    }
    else {
        if(healthPotionCount <= 0){
            instructionsContainer.textContent = "You have no more potions";
        }
        else {
            instructionsContainer.textContent = "You are at Max Health";
        }
    }
});

// ***RESET BUTTON LISTENER***
resetBtn.addEventListener('click', ()=>{
    if (enemyHealth > 0 && playerHealth > 0 && potionCount > 0){
        const yesBtnHTML = `<button class="yes">Yes</button>`;
        const noBtnHTML = `<button class="no">no</button>`;
        const stringQst = `<p class="instructions">Are you sure? You can win this!</p>`
        instructionsContainer.innerHTML = stringQst + yesBtnHTML + noBtnHTML;
        const yesBtn = document.querySelector('.yes');
        const noBtn = document.querySelector('.no');
        yesBtn.addEventListener('click', () =>{
            reset();
        }, { once: true });
        noBtn.addEventListener('click', () =>{
            instructionsContainer.textContent = "Don't give up yet! Choose a spell!"
        })
    }
    else {
        reset();
    }
});

//*** FUNCTIONS ***
//Button listener fuction for the cards
function addSpellListeners() {
    const cardBtns = document.querySelectorAll('.spell-card');

    cardBtns.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (enemyHealth > 0 && playerMana >= spells[index].mana && playerHealth > 0) {
                castSpell = spells[index]
                enemyHealth -= castSpell.power;
                playerMana -= castSpell.mana;
                manaContainer.textContent = playerMana;
                instructionsContainer.textContent = `You cast ${castSpell.name} for ${castSpell.power} power!`;
                enemyHealthContainer.textContent = enemyHealth;
                if (enemyHealth <= 0){
                    gameOver();
                }
                else{
                    enemyAttack();
                }
            }          
            else if (enemyHealth <= 0)
            {
                gameOver();
            } 
            else {
                instructionsContainer.textContent = "You don't Have enough Mana!"
            }
        })
    })
};

function enemyAttack(){
    const attackNum = Math.floor(Math.random()*25)*3;
    playerHealth -=attackNum;
    enemyAttackContainer.textContent = `Enemy hit for ${attackNum}!`;
    playerHealthContainer.textContent = playerHealth;
    if (playerHealth <= 0){
        gameOver();
    }
};

let playerDeath = 0;
let enemyDeath = 0;

function gameOver(){
    const playerDeathContainer = document.querySelector('.player-death-count');
    const enemyDeathContainer = document.querySelector('.enemy-death-count');

    if (enemyHealth <= 0){
        cardsContainer.textContent = "Enemy Defeated!";
        enemyDeath++;
        enemyDeathContainer.textContent = `Enemy Death: ${enemyDeath}`;
        enemyHealthContainer.textContent = 0;
    }
    else {
        cardsContainer.textContent = "You Died";
        playerDeath++;
        playerDeathContainer.textContent = `Player Death: ${playerDeath}`;
        playerHealthContainer.textContent = 0;
    }
    instructionsContainer.textContent = "Reset to Attack Again!";
    bothPotionContainer.style.display = "none";
    
};

function reset(){
    //resets the player and enemy
    enemyHealth = 75;
    playerMana = 100;    
    playerHealth = 100;    
    potionCount = 3;
    healthPotionCount = 3;
    
    //resets the text
    enemyHealthContainer.textContent = enemyHealth;
    manaContainer.textContent = playerMana;
    playerHealthContainer.textContent = playerHealth;
    potionContainer.textContent = 3;
    healthPotionContainer.textContent = 3;
    enemyAttackContainer.textContent = "";
    instructionsContainer.textContent = "Choose a Spell."
    
    //resets the cards
    cardsContainer.innerHTML = joinCardsHTML;
    bothPotionContainer.style.display = "";
    addSpellListeners();
};


//not really needed for this but was testing .map
const spellIsolation = spells.map(function (eachSpell){
    return eachSpell.name;
    
})
console.log(spellIsolation);

const filteredSpells = spells.filter(function(eachSpell){
    return eachSpell.power >= 18;
})
console.log(filteredSpells);

const testIsolation = spells
    .filter(function(eachSpell){
        return eachSpell.power >= 18;
    })
    .map(function(eachSpell){
        return eachSpell.name
    });

console.log(testIsolation);

