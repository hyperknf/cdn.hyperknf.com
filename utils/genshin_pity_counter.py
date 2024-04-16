import random, statistics

config = {
    "four": {
        "chance": 0.051
    },
    "five": {
        "chance": 0.006
    }
}

pulls = str()
while not pulls.isdigit() or int(pulls) <= 0:
    pulls = input("Enter the amount of pulls: ")
pulls = int(pulls)

def usd(primos):
    return primos / 65.6
three = 0
four = 0
five = 0
no_four = 0
no_five = 0
four_pity = []
five_pity = []
for pull in range(1, pulls + 1):
    rng = random.randint(1, 1000)
    five_max = config["five"]["chance"] * 1000
    four_max = config["four"]["chance"] * 1000

    def getFourChance():
        return four_max * (1 + 10 * max(0, no_four - 8))
    def getFiveChance():
        return five_max * (1 + 10 * max(0, no_five - 73))

    if rng <= getFiveChance():
        five_pity.append(no_five + 1)
        print(f"Pull {pull}: 5 star <<<<<" if no_five < 73 else f"Pull {pull}: 5 star (pity) <<<<<")

        five += 1
        no_five = 0
    elif rng <= getFourChance() + getFourChance():
        four_pity.append(no_four + 1)
        print(f"Pull {pull}: 4 star <<" if no_four < 8 else f"Pull {pull}: 4 star (pity) <<")

        four += 1
        no_five += 1
        no_four = 0
    else:
        three += 1
        no_four += 1
        no_five += 1
        print(f"Pull {pull}: 3 star")

print(f"\n5 star probability: {(five / pulls * 100):.5f}%")
print(f"4 star probability: {(four / pulls * 100):.5f}%")
print(f"4+ star probability: {((four + five) / pulls * 100):.5f}%")
five_show = round(statistics.mean(five_pity), 5) if len(five_pity) > 0 else "N/A"
five_usd = five_show if five_show is str else round(usd(five_show * 160), 5)
print(f"\n5 star average pity: {five_show:.5f} (${five_usd:.5f})")
four_show = round(statistics.mean(four_pity), 5) if len(four_pity) > 0 else "N/A"
four_usd = four_show if four_show is str else round(usd(four_show * 160), 5)
print(f"4 star average pity: {four_show:.5f} (${four_usd:.5f})")
