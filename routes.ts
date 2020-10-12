import { Router, send } from './deps.ts';

const router = new Router();

router.get('/', async (ctx) => {
    await send(ctx, 'index.html', {
        root: `${Deno.cwd()}/public`
    });
});

// Keep this in sync with the 
const cars = [
    'mustang',
    'mercedes'
];

for (const car of cars) {
    router.get(`/${car}`, async (ctx) => {
        await send(ctx, `${car}.html`, {
            root: `${Deno.cwd()}/public/cars`
        });
    });
}

export default router;