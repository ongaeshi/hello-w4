import * as w4 from "./wasm4";

const smiley = memory.data<u8>([
    0b11000011,
    0b10000001,
    0b00100100,
    0b00100100,
    0b00000000,
    0b00100100,
    0b10011001,
    0b11000011,
]);

export function update (): void {
    // store<u16>(w4.DRAW_COLORS, 2);
    // w4.text("Hello from\nAssemblyScript!", 10, 10);

    // const gamepad = load<u8>(w4.GAMEPAD1);
    // if (gamepad & w4.BUTTON_1) {
    //     store<u16>(w4.DRAW_COLORS, 4);
    // }

    store<u16>(w4.DRAW_COLORS, 2)
    w4.blit(smiley, 76, 76, 8, 8, w4.BLIT_1BPP);
    // w4.text("Press X to blink", 16, 90);
    w4.text("Hello, World!", 32, 90);

    // 2bit demichrome Palette
    // https://lospec.com/palette-list/2bit-demichrome
    // store<u32>(w4.PALETTE, 0x211e20, 0 * sizeof<u32>());
    // store<u32>(w4.PALETTE, 0x555568, 1 * sizeof<u32>());
    // store<u32>(w4.PALETTE, 0xa0a08b, 2 * sizeof<u32>());
    // store<u32>(w4.PALETTE, 0xe9efec, 3 * sizeof<u32>());

    // 1度のupdateで使える色は4色まで。
    store<u16>(w4.DRAW_COLORS, 2)
    w4.rect(4, 10, 32, 32)
    // w4.trace("Hello world!")

    // Ice Cream GB Palette
    // https://lospec.com/palette-list/ice-cream-gb
    store<u32>(w4.PALETTE, 0xfff6d3, 0 * sizeof<u32>()); // color 1
    store<u32>(w4.PALETTE, 0xf9a875, 1 * sizeof<u32>()); // color 2
    store<u32>(w4.PALETTE, 0xeb6b6f, 2 * sizeof<u32>()); // color 3
    store<u32>(w4.PALETTE, 0x7c3f58, 3 * sizeof<u32>()); // color 4

    // rect() uses the first draw color for the fill color, and the second draw color as the outline color.
    store<u16>(w4.DRAW_COLORS, 0x42);
    w4.rect(4 + 40, 10, 32, 32);

    store<u16>(w4.DRAW_COLORS, 0x40);
    w4.rect(4 + 80, 10, 32, 32);

    // Direct Framebuffer Access#
    // memory.fill(w4.FRAMEBUFFER, 3 | (3 << 2) | (3 << 4) | (3 << 6), 160*160/4);

    store<u16>(w4.DRAW_COLORS, 2);
    for (let x: i32 = 0; x < 160; x += 2) {
        pixel(x, 48)
    }
    store<u16>(w4.DRAW_COLORS, 3);
    for (let x: i32 = 0; x < 160; x += 3) {
        pixel(x, 60)
    }
    store<u16>(w4.DRAW_COLORS, 4);
    for (let x: i32 = 0; x < 160; x += 4) {
        pixel(x, 72)
    }
}

function pixel (x: i32, y: i32): void {
    // The byte index into the framebuffer that contains (x, y)
    const idx = (y*160 + x) >> 2;

    // Calculate the bits within the byte that corresponds to our position
    const shift = u8((x & 0b11) << 1);
    const mask = u8(0b11 << shift);

    // Use the first DRAW_COLOR as the pixel color.
    const palette_color = u8(load<u16>(w4.DRAW_COLORS) & 0b1111);
    if (palette_color == 0) {
        // Transparent
        return;
    }
    const color = (palette_color - 1) & 0b11;

    // Write to the framebuffer
    store<u8>(w4.FRAMEBUFFER + idx, (color << shift) | (load<u8>(w4.FRAMEBUFFER + idx) & ~mask));
}