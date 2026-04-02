#include <iostream>
#include <vector>
#include <string>
#include <cstdint>
#include <sstream>
#include <iomanip>

using namespace std;

typedef uint32_t block;

// ================= URL DECODE =================
string urlDecode(string str) {
    string ret;
    char ch;
    int ii;

    for (int i = 0; i < str.length(); i++) {
        if (str[i] == '%') {
            sscanf(str.substr(i + 1, 2).c_str(), "%x", &ii);
            ch = static_cast<char>(ii);
            ret += ch;
            i += 2;
        }
        else if (str[i] == '+') {
            ret += ' ';
        }
        else {
            ret += str[i];
        }
    }
    return ret;
}

// ================= FEISTEL =================
block F(block right, block key) {
    block r = right & 0xFFFF;
    block k = key & 0xFFFF;
    return ((r ^ k) + ((r << 3) | (r >> 2))) & 0xFFFF;
}

void feistelEncryptRound(block& left, block& right, block key) {
    block temp = right;
    right = left ^ F(right, key);
    left = temp;
}

block encryptBlock(block data, block keys[], int rounds) {
    block left = (data >> 16) & 0xFFFF;
    block right = data & 0xFFFF;

    for (int i = 0; i < rounds; i++)
        feistelEncryptRound(left, right, keys[i]);

    return ((left & 0xFFFF) << 16) | (right & 0xFFFF);
}

block decryptBlock(block data, block keys[], int rounds) {
    block left = (data >> 16) & 0xFFFF;
    block right = data & 0xFFFF;

    for (int i = rounds - 1; i >= 0; i--) {
        block temp = left;
        left = right ^ F(left, keys[i]);
        right = temp;
    }

    return ((left & 0xFFFF) << 16) | (right & 0xFFFF);
}

// ================= TEXT =================
vector<block> textToBlocks(string text) {
    vector<block> blocks;

    for (size_t i = 0; i < text.size(); i += 4) {
        block b = 0;
        for (int j = 0; j < 4; j++) {
            b <<= 8;
            if (i + j < text.size())
                b |= (unsigned char)text[i + j];
        }
        blocks.push_back(b);
    }
    return blocks;
}

vector<block> hexToBlocks(string hexStr) {
    vector<block> blocks;
    stringstream ss(hexStr);
    string item;

    while (ss >> item) {
        block b;
        stringstream(item) >> hex >> b;
        blocks.push_back(b);
    }
    return blocks;
}

string blocksToText(vector<block> blocks) {
    string text = "";

    for (block b : blocks) {
        for (int i = 3; i >= 0; i--) {
            char c = (b >> (i * 8)) & 0xFF;
            if (c != 0)
                text += c;
        }
    }
    return text;
}

// ================= OTP TEXT =================
block getOTPKey(string key, size_t index) {
    block k = 0;

    for (int i = 0; i < 4; i++) {
        k <<= 8;
        k |= (unsigned char)key[(index * 4 + i) % key.size()];
    }

    return k;
}

// ================= MAIN =================
int main(int argc, char* argv[]) {

    if (argc < 4) {
        cout << "ERROR";
        return 1;
    }

    string mode = argv[1];
    string input = urlDecode(argv[2]);
    string otpKeyStr = urlDecode(argv[3]);

    block keys[4] = { 0x0F0F, 0xAAAA, 0x1357, 0xBEEF };

    vector<block> blocks;
    vector<block> result;

    if (mode == "encrypt")
        blocks = textToBlocks(input);
    else
        blocks = hexToBlocks(input);

    for (size_t i = 0; i < blocks.size(); i++) {

        block otpKey = getOTPKey(otpKeyStr, i);

        if (mode == "encrypt") {
            block temp = blocks[i] ^ otpKey;
            result.push_back(encryptBlock(temp, keys, 4));
        }
        else {
            block temp = decryptBlock(blocks[i], keys, 4);
            result.push_back(temp ^ otpKey);
        }
    }

    if (mode == "encrypt") {
        cout << hex << setfill('0');
        for (auto b : result)
            cout << setw(8) << b << " ";
    }
    else {
        cout << blocksToText(result);
    }

    return 0;
}