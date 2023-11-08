import { Console, Random } from "@woowacourse/mission-utils";
import Money from "./Money.js";
import GAME_MESSAGES from "./constants/GameMessages.js";
import Lotto from "./Lotto.js";
import ERROR_MESSAGES from "./constants/ErrorMessage.js";
import LOTTO_MESSAGES from "./constants/LottoMessages.js";

class App {
  async play() {
    const money = new Money();
    const userMoney = await money.userMoney();
    const lottoCount = parseInt(userMoney / 1000, 10);
    Console.print(`\n${lottoCount}${GAME_MESSAGES.COUNT_LOTTO}`);
    let lottos = this.generateLottoNumber(lottoCount);
    this.getWinningNumbers(lottos);
  }

  async getWinningNumbers(lottos) {
    const winningNumber = await Console.readLineAsync(
      GAME_MESSAGES.INPUT_WINNING_NUMBER,
    );
    let winningNumberArray = winningNumber
      .split(",")
      .map((x) => parseInt(x, 10));

    try {
      const winning = new Lotto(winningNumberArray);
      this.getBonusNumber(lottos, winning);
    } catch (error) {
      Console.print(`${error.message}`);
    }
  }

  async getBonusNumber(lottos, winning) {
    const bonusNumber = await Console.readLineAsync(
      GAME_MESSAGES.INPUT_BONUS_NUMBER,
    );

    if (isNaN(bonusNumber)) throw new Error(ERROR_MESSAGES.IS_BONUS_NUMBER);
    if (winning.getNumber().includes(parseInt(bonusNumber, 10)))
      throw new Error(ERROR_MESSAGES.IS_BONUS_DUPLICATION);
    if (
      bonusNumber < LOTTO_MESSAGES.MIN_LOTTO_NUMBER ||
      bonusNumber > LOTTO_MESSAGES.MAX_LOTTO_NUMBER
    )
      throw new Error(ERROR_MESSAGES.IS_BONUS_RANGE);
    let winningNumber = winning.getNumber();
    this.winningLotto(winningNumber, bonusNumber, lottos);
  }

  winningLotto(winningNumber, bonusNumber, lottos) {
    const winningResultArray = new Array(6).fill(0);
    lottos.map((lotto) => {
      winningResultArray[
        this.isCorrectNumber(winningNumber, bonusNumber, lotto)
      ] += 1;
    });

    Console.print(GAME_MESSAGES.WINNING_STATISTICS);
    this.printWinningResult(winningResultArray);
    this.printRateOfReturn(winningResultArray, lottos.length);
  }

  printRateOfReturn(winningResultArray, quantity) {
    let money = 0;
    money =
      winningResultArray[1] * 2000000000 +
      winningResultArray[2] * 30000000 +
      winningResultArray[3] * 1500000 +
      winningResultArray[4] * 50000 +
      winningResultArray[5] * 5000;
    let rateOfReturn = Math.round((money / (quantity * 1000)) * 1000) / 10;
    Console.print(`총 수익률은 ${rateOfReturn}%입니다.`);
  }

  printWinningResult(winningResultArray) {
    Console.print(
      `${LOTTO_MESSAGES.COINCIDE_THREE_NUMBER}${winningResultArray[5]}개`,
    );
    Console.print(
      `${LOTTO_MESSAGES.COINCIDE_FOUR_NUMBER}${winningResultArray[4]}개`,
    );
    Console.print(
      `${LOTTO_MESSAGES.COINCIDE_FIVE_NUMBER}${winningResultArray[3]}개`,
    );
    Console.print(
      `${LOTTO_MESSAGES.COINCIDE_FIVE_BONUS_NUMBER}${winningResultArray[2]}개`,
    );
    Console.print(
      `${LOTTO_MESSAGES.COINCIDE_SIX_NUMBER}${winningResultArray[1]}개`,
    );
  }

  isCorrectNumber(winningNumber, bonusNumber, lotto) {
    let count = winningNumber.filter((x) => lotto.includes(x)).length;

    if (count === LOTTO_MESSAGES.SIX_CORRECT) return 1;
    if (count === LOTTO_MESSAGES.FIVE_CORRECT && lotto.includes(bonusNumber))
      return 2;
    if (count === LOTTO_MESSAGES.FIVE_CORRECT) return 3;
    if (
      count === LOTTO_MESSAGES.FOUR_CORRECT ||
      count === LOTTO_MESSAGES.THREE_CORRECT
    )
      return 8 - count;

    return 0;
  }

  generateLottoNumber(lottoCount) {
    const lottos = [];

    for (let i = 0; i < lottoCount; i += 1) {
      const lottoNumbers = this.generateUniqueLottoNumbers();
      lottos.push(lottoNumbers);
    }

    this.printLottoNumbers(lottos);
    return lottos;
  }

  generateUniqueLottoNumbers() {
    const lottoNumbers = new Set();

    while (lottoNumbers.size < 6) {
      const randomNumber = Random.pickUniqueNumbersInRange(1, 45, 6);
      randomNumber.forEach((num) => lottoNumbers.add(num));
    }

    return Array.from(lottoNumbers).sort((a, b) => a - b);
  }

  printLottoNumbers(lottos) {
    lottos.forEach((lotto) => {
      Console.print(`[${lotto.join(", ")}]`);
    });
  }
}

export default App;
