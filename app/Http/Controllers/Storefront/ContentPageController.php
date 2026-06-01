<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ContentPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('storefront/about');
    }

    public function delivery(): Response
    {
        return Inertia::render('storefront/delivery');
    }

    public function returns(): Response
    {
        return Inertia::render('storefront/returns');
    }
}
