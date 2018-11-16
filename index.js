/**
 * @file babel编译
 * @author lizeren
 */
require('@babel/register')({
    'presets': [
        [
            '@babel/preset-env',
            {
                'targets': {
                    'node': true
                },
                'modules': 'commonjs',
                'loose': true
            }
        ]
    ]
});
require('./main');