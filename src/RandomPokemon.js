import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
const { Component } = require("react");


const NUMBER_OF_POKEMON = 898;
const NUMBER_OF_ITEMS = 89;
const MIN_ITEM_NO = 149
const NUMBER_OF_NATURES = 25;

const NUMBER_OF_MOVES = 4;

const STATS = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const TOTAL_EVS = 510


class RandomPokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemonNo: Math.floor(Math.random() * NUMBER_OF_POKEMON) + 1,
      itemNo: this.selectRandomItemNo(),
      natureNo: Math.floor(Math.random() * NUMBER_OF_NATURES) + 1
    };
  }

  selectRandomItemNo() {
    let item = 193;

    while (item == 193) {
      item = Math.floor(Math.random() * NUMBER_OF_ITEMS) + MIN_ITEM_NO
    }

    return item;
  }

  selectRandomElement(arr) {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  selectRandomMoves(moveSet) {
    let selectedMoves = new Set();

    while (selectedMoves.size < NUMBER_OF_MOVES) {
      selectedMoves.add(this.selectRandomElement(moveSet).move.name);
    }

    let move_string = ''
    Array.from(selectedMoves).forEach(move => {
      move_string = move_string.concat('- ' + move + '\n');
    });
    return move_string
  }

  componentDidMount() {
    P.getPokemonByName(this.state.pokemonNo)
      .then(response => {
        console.log(response)
        this.setState({
          name: response.name,
          ability: this.selectRandomElement(response.abilities).ability.name,
          moves: this.selectRandomMoves(response.moves)
        });
      })
      .catch(error => {
        console.log('There was an ERROR: ', error);
      });

    P.getItemByName(this.state.itemNo)
      .then(response => {
        console.log(response);
        this.setState({
          item: response.name
        })
      })
      .catch(error => {
        console.log("Error: ", error);
      })

    P.getNatureByName(this.state.natureNo)
    .then(response => {
      console.log(response);
      this.setState({
        nature: response.name
      })
    })
    .catch(error => {
      console.log("Error: ", error);
    })

    // EVs
    let ev_values = []
    STATS.forEach(stat => {
      ev_values.push(0);
    })
    for (let i = 0; i < TOTAL_EVS; i++) {
      // select random EV to push
      let successfulPush = false;

      while (!successfulPush) {
        let randomStat = Math.floor(Math.random() * STATS.length);
        let currStatVal = ev_values[randomStat];

        if (currStatVal == 252) {
          continue;
        } else {
          ev_values[randomStat] = currStatVal + 1;
          successfulPush = true;
        }
      }
    }
    let ev_string = "EVs: ";
    for (let i = 0; i < STATS.length; i++) {
      ev_string = ev_string.concat(ev_values[i] + ' ');
      ev_string = ev_string.concat(STATS[i] + ' ');
      if (i != STATS.length - 1) {
        ev_string = ev_string.concat('/ ');
      }
    }

    this.setState({
      evs: ev_string
    })

    let iv_values = []
    STATS.forEach(stat => {
      iv_values.push(Math.floor(Math.random() * 32));
    })

    let iv_string = "IVs: ";
    for (let i = 0; i < STATS.length; i++) {
      iv_string = iv_string.concat(iv_values[i] + ' ');
      iv_string = iv_string.concat(STATS[i] + ' ');
      if (i != STATS.length - 1) {
        iv_string = iv_string.concat('/ ');
      }
    }
    this.setState({
      ivs: iv_string
    })
  }

  render() {
    return (
      <div>
        <pre>
          {this.state.name} @ {this.state.item + '\n'}
          Ability: {this.state.ability + '\n'}
          {this.state.evs + '\n'}
          {this.state.nature} Nature {'\n'}
          {this.state.ivs + '\n'}
          {this.state.moves + '\n'}
        </pre>
      </div>
    );
  }
}

export default RandomPokemon;
