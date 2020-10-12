import { Application, send } from './deps.ts'

import router from './routes.ts';

const app = new Application();
const port = 8080;

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(router.routes());

// We use this dynamic loader to load stylesheets etc. (You actually can send html files using this middleware but we use the routes for that)
app.use(async (ctx) => {
    const filePath = ctx.request.url.pathname;
    const fileWhitelist = [
        '/style.css'
    ]
    if (fileWhitelist.includes(filePath)) {
        await send(ctx, filePath, {
            root: `${Deno.cwd()}/public`
        });
    } else {
        await send(ctx, '/error.html', {
            root: `${Deno.cwd()}/public`
        });
    }
});

if (import.meta.main) {
    await app.listen({
        port: port
    });
}