#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>

#include "board.c"

// int starting_moves[4] = { 2, 4, 6, 8 };

int rand_move(int state[9]) {
    srand(rand() * time(0));

    int move = rand() % 9;
    while (state[move]) move = rand() % 9;
    return move;
}

int winning_move(int state[9], bool is_x) {
    int move = is_x ? X : O;
    for (int i = 0; i < 9; i++) {
        if (state[i]) continue;
        int calc[9] = {
            state[0],
            state[1],
            state[2],
            state[3],
            state[4],
            state[5],
            state[6],
            state[7],
            state[8],
        };
        calc[i] = move;
        if (won(calc)) return i;
    }
    return -1;
}

int win_or_block(int state[9], bool is_x) {
    int winning = winning_move(state, is_x);
    if (winning != -1) return winning;
    int blocking = winning_move(state, !is_x);
    if (blocking != -1) return blocking;
    return -1;
}

int basic_move(int state[9], bool is_x) {
    int win_block_move = win_or_block(state, is_x);
    if (win_block_move != -1) return win_block_move;
    return rand_move(state);
}

int minimax(int board[9], int player) {
    int winner = won(board);
    if (winner != 0) return winner * player;

    int move = -1;
    int score = -2;
    for (int i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = player;
        int cell_score = -minimax(board, -player);
        if (cell_score > score) {
            score = cell_score;
            move = i;
        }
        board[i] = EMPTY;
    }
    if (move == -1) return 0;
    return score;
}

int best_move(int state[9], bool is_x) {
    int wb = win_or_block(state, is_x);
    if (wb != -1) return wb;

    int board[9] = {
        state[0],
        state[1],
        state[2],
        state[3],
        state[4],
        state[5],
        state[6],
        state[7],
        state[8],
    };
    if (is_x) for (int i = 0; i < 9; i++) board[i] = -board[i];

    int move = -1;
    int score = -2;
    for (int i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = O;
        int cell_score = -minimax(board, X);
        board[i] = EMPTY;
        if (cell_score > score) {
            score = cell_score;
            move = i;
        }
    }
    
    return move == -1 ? rand_move(board) : move;
}