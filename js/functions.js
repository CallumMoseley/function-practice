var questionText = $('#questionText');
var answerText = $('#answerText');
var questionBox = $('#questionBoard');
var answerBox = $('#answerBoard');
var questionContainer = $('#questionContainer');
var answerContainer = $('#answer');
var back = $('#back');
var functionPlot = window.functionPlot;

var akEasy = ['1', '2', '3', '1/2'];
var akMedium = ['1', '2', '3', '4', '1/2', '1/3', '1/4'];
var akHard = ['1', '2', '3', '4', '5', '1/2', '1/3', '1/4', '2/3', '3/2', '3/4', '4/3'];

var trigP = [0, 1/2, 1, 3/2];
var radianP = ['', '<mfrac><mi>&pi;</mi><mn>2</mn></mfrac>', '<mi>&pi;</mi>', '<mfrac><mrow><mn>3</mn><mi>&pi;</mi></mrow><mn>2</mn></mfrac>'];

var functions = [];
var akValues = akEasy;

var f;
var a;
var k;
var p;
var q;

var q1;
var q2;

var radians = false;

back.hide();
questionContainer.hide();

$('#start').click(function() {
    functions = [];
    if ($('#sqr').is(':checked')) {
        functions.push(square);
    }
    if ($('#cube').is(':checked')) {
        functions.push(cube);
    }
    if ($('#abs').is(':checked')) {
        functions.push(absolute);
    }
    if ($('#sqrt').is(':checked')) {
        functions.push(squareRoot);
    }
    if ($('#recip').is(':checked')) {
        functions.push(reciprocal);
    }
    if ($('#sin').is(':checked')) {
        functions.push(sine);
    }
    if ($('#cos').is(':checked')) {
        functions.push(cosine);
    }

    q1 = $('#q1').is(':checked');
    q2 = $('#q2').is(':checked');

    radians = $('#rad').is(':checked');

    if (functions.length === 0) {
        alert('You must choose at least 1 parent function');
        return;
    }
    if (!q1 && !q2) {
        alert('You must choose at least 1 question type');
        return;
    }

    switch ($('#difficulty').val()) {
        case 'e':
            akValues = akEasy;
            break;
        case 'm':
            akValues = akMedium;
            break;
        case 'h':
            akValues = akHard;
            break;
        default:
            akValues = akEasy;
    }

    $('#intro').hide();
    back.show();
    back.css('display', 'inline-block');
    questionContainer.show();

    generateQuestion(functions, akValues);
});

back.click(function() {
    $('#intro').show();
    questionContainer.hide();
    $(this).hide();
});

$('#nextQuestion').click(function() {
    generateQuestion();
});

$('#revealAnswer').click(function() {
    answerContainer.show();
});

function resize() {

}

function generateQuestion() {
    answerContainer.hide();

    var funcObj = functions[Math.floor(Math.random() * functions.length)];
    var name = funcObj.name;
    a = (Math.floor(Math.random() * 2) == 0 ? '-' : '') + akValues[Math.floor(Math.random() * akValues.length)];
    k = (Math.floor(Math.random() * 2) == 0 ? '-' : '') + akValues[Math.floor(Math.random() * akValues.length)];
    q = Math.floor(Math.random() * 11) - 5;
    var rp;
    if (funcObj.qname === 'sin' || funcObj.qname === 'cos') {
        var i = Math.floor(trigP.length * Math.random());
        if (radians) {
            rp = radianP[i];
        } else {
            rp = 180 * trigP[i] + '°';
        }
        p = 4 * trigP[i] * (Math.floor(Math.random() * 2) * 2 - 1);
    } else {
        p = Math.floor(Math.random() * 11) - 5;
    }
    f = funcObj;

    var math;
    if (q1 && q2) {
        switch (Math.floor(Math.random() * 2)) {
            case 0: // Give the equation, user graphs
                if (funcObj.qname === 'sin' || funcObj.qname === 'cos') {
                    math = generateMathML(a, k, p, q, rp);
                } else {
                    math = generateMathML(a, k, p, q);
                }
                questionText.html('Graph the function: ' + math + ' where <math><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>' + name + '</math>');
                questionBox.hide();
                answerText.html('');
                answerBox.show();
                graph('#answerBoard');
                break;
            case 1: // Give the graph, user finds equation
                if (funcObj.qname === 'sin' || funcObj.qname === 'cos') {
                    math = generateMathML(a, k, p, q, rp);
                } else {
                    math = generateMathML(a, k, p, q);
                }
                questionText.html('Determine the base function and transformations of the following graph:');
                questionBox.show();
                answerText.html(math + ' where <math><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>' + name + '</math>');
                answerBox.hide();
                graph('#questionBoard');
                break;
        }
    } else if (q1) {
        if (funcObj.qname === 'sin' || funcObj.qname === 'cos') {
            math = generateMathML(a, k, p, q, rp);
        } else {
            math = generateMathML(a, k, p, q);
        }
        questionText.html('Graph the function: ' + math + ' where <math><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>' + name + '</math>');
        questionBox.hide();
        answerText.html('');
        answerBox.show();
        graph('#answerBoard');
    } else if (q2) {
        if (funcObj.qname === 'sin' || funcObj.qname === 'cos') {
            math = generateMathML(a, k, p, q, rp);
        } else {
            math = generateMathML(a, k, p, q);
        }
        questionText.html('Determine the base function and transformations of the following graph:');
        questionBox.show();
        answerText.html(math + ' where <math><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>' + name + '</math>');
        answerBox.hide();
        graph('#questionBoard');
    }
}

function graph(id) {
    var xdom = [-8, 8];
    var ann = [];
    if (f.qname === 'recip') {
        ann.push({
            x: -p
        });
        ann.push({
            y: q
        });
    }
    var d = [{
        fn: f.func(eval(a), eval(k) * ((f.qname === 'sin' || f.qname === 'cos') ? Math.PI / 4 : 1), p, q),
        skipTip: true
    }];

    var instance = functionPlot({
        target: id,
        xDomain: xdom,
        yDomain: [-8, 8],
        width: 600,
        height: 600,
        grid: true,
        annotations: ann,
        data: d
    });

    $(instance.canvas[0][0]).find('.content').find('.annotations').find('path').each(function () {
        $(this).attr('stroke', '#666');
    });
    $(instance.canvas[0][0]).find('.content').find('path').each(function () {
        $(this).attr('opacity', '0.8');
    });

    if (f.qname === 'sin' || f.qname === 'cos') {
        if (radians) {
            instance.meta.xAxis.tickFormat(function(d) {
                var f = new Fraction(d * 1 / 4);
                return (f.numerator === 1 ? '' : f.numerator === -1 ? '-' : f.numerator) + (f.numerator === 0 ? 0 : ('π' + (f.denominator === 1 ? '' : '/' + f.denominator)));
            });
        } else {
            instance.meta.xAxis.tickFormat(function(d) {
                return (45 * d).toPrecision(3) + '°';
            });
        }
    }

    instance.draw();
}

function generateMathML(a, k, p, q, radianP) {
    var math = '<math>';
    switch (a) {
        case '-1':
            math += '<mo>-</mo>';
            break;
        case '1':
            break;
        case '2':
        case '3':
        case '4':
        case '5':
        case '-2':
        case '-3':
        case '-4':
        case '-5':
            math += '<mn>' + a + '</mn>';
            break;
        default:
            var au = a.split('/');
            math += '<mfrac><mn>' + au[0] + '</mn><mn>' + au[1] + '</mn></mfrac>';
            break;
    }
    math += '<mi>f</mi>';
    math += '<mo>(</mo>';
    switch (k) {
        case '-1':
            math += '<mo>-</mo>';
            break;
        case '1':
            break;
        case '2':
        case '3':
        case '4':
        case '5':
        case '-2':
        case '-3':
        case '-4':
        case '-5':
            math += '<mn>' + k + '</mn>';
            break;
        default:
            var z = k.split('/');
            math += '<mfrac><mn>' + z[0] + '</mn><mn>' + z[1] + '</mn></mfrac>';
            break;
    }
    if (k != '1' && p != 0) {
        math += '<mo>(</mo>';
    }
    math += '<mi>x</mi>';
    if (radianP) {
        if (p > 0) {
            math += '<mo>+</mo>' + radianP;
        } else if (p < 0) {
            math += '<mo>-</mo>' + radianP;
        }
    } else {
        if (p > 0) {
            math += '<mo>+</mo><mn>' + Math.abs(p) + '</mn>';
        } else if (p < 0) {
            math += '<mo>-</mo><mn>' + Math.abs(p) + '</mn>';
        }
    }
    if (k != '1' && p != 0) {
        math += '<mo>)</mo>';
    }
    math += '<mo>)</mo>';
    if (q > 0) {
        math += '<mo>+</mo><mn>' + q + '</mn>';
    } else if (q < 0) {
        math += '<mo>-</mo><mn>' + Math.abs(q) + '</mn>';
    }
    math += '</math>';

    return math;
}

var square = {
    func: function (a, k, p, q)
    {
        return 'y='+a+'*('+k+'*(x+'+p+'))^2+'+q;
    },
    name: '<msup><mi>x</mi><mn>2</mn></msup>',
    qname: 'sqr'
};
var cube = {
    func: function (a, k, p, q) {
        return 'y='+a+'*('+k+'*(x+'+p+'))^3+'+q;
    },
    name: '<msup><mi>x</mi><mn>3</mn></msup>',
    qname: 'cube'
};
var squareRoot = {
    func: function (a, k, p, q) {
        return 'y='+a+'*sqrt('+k+'*(x+'+p+'))+'+q;
    },
    name: '<msqrt><mi>x</mi></msqrt>',
    qname: 'sqrt'
};
var reciprocal = {
    func: function (a, k, p, q) {
        return 'y='+a+'*1/('+k+'*(x+'+p+'))+'+q;
    },
    name: '<mfrac><mn>1</mn><mi>x</mi></mfrac>',
    qname: 'recip'
};
var absolute = {
    func: function (a, k, p, q) {
        return 'y='+a+'*abs('+k+'*(x+'+p+'))+'+q;
    },
    name: '<mo>|</mo><mi>x</mi><mo>|</mo>',
    qname: 'abs'
};
var sine = {
    func: function (a, k, p, q) {
        return 'y='+a+'*sin('+k+'(x+'+p+'))+'+q;
    },
    name: '<mi>sin</mi><mi>x</mi>',
    qname: 'sin'
};
var cosine = {
    func: function (a, k, p, q) {
        return 'y='+a+'*cos('+k+'*(x+'+p+'))+'+q;
    },
    name: '<mi>cos</mi><mi>x</mi>',
    qname: 'cos'
};