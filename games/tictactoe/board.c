#include <stdbool.h>

#define EMPTY 0
#define X -1
#define O 1

int dummy = 0;

char x() {
    return 'X';
}
char o() {
    return 'O';
}
char empty() {
    return '_';
}

int wins[8][3] = {
    {0, 1, 2},
    {3, 4, 5},
    {6, 7, 8},
    {0, 3, 6},
    {1, 4, 7},
    {2, 5, 8},
    {0, 4, 8},
    {2, 4, 6}
};

char format_cell(int state) {
    return (state == -1) ? x() : (state == 1) ? o() : empty();
}

char* format_board(int state[9]) {
    static char result[27];
    sprintf(result, "%c %c %c\n%c %c %c\n%c %c %c",
        format_cell(state[0]),
        format_cell(state[1]),
        format_cell(state[2]),
        format_cell(state[3]),
        format_cell(state[4]),
        format_cell(state[5]),
        format_cell(state[6]),
        format_cell(state[7]),
        format_cell(state[8])
    );
    return result;
}

int won(int state[9]) {
    for (int i = 0; i < 8; i++) if (state[wins[i][0]] && state[wins[i][0]] == state[wins[i][1]] && state[wins[i][0]] == state[wins[i][2]]) return state[wins[i][0]];
    return 0;
}