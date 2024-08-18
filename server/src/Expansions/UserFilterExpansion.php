<?php

namespace Fleetbase\FleetOps\Expansions;

use Fleetbase\Build\Expansion;

class UserFilterExpansion implements Expansion
{
    /**
     * Get the target class to expand.
     *
     * @return string|Class
     */
    public static function target()
    {
        return \Fleetbase\Http\Filter\UserFilter::class;
    }

    /**
     * @return void
     */
    public static function doesntHaveDriver()
    {
        return function () {
            /* @var \Fleetbase\Http\Filter\UserFilter $this */
            $this->builder->whereDoesntHave('driver');
        };
    }
}
