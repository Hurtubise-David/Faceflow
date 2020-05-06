alert("Connected");

var rank = [2,3,4,5];

var shape = [2,2];

var dataType = 'int32';

// Pass an array of values to create a vector.
var tensorData = tf.tensor(rank, shape, dataType);

console.log(tensorData.toString());

// Math operation
const a = tf.tensor([1, 2, 3, 4]);
const b = tf.tensor([10, 20, 30, 40]);

tf.sub(a, b).print();

// y = 2 ^ 2 + 1
const y = tf.tidy(() => {
    // a, b, and one will be cleaned up when the tidy ends.
    const one = tf.scalar(1);
    const a = tf.scalar(2);
    const b = a.square();
  
    console.log('numTensors (in tidy): ' + tf.memory().numTensors);
  
    // The value returned inside the tidy function will return
    // through the tidy, in this case to the variable y.
    return b.add(one);
  });
  
  console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
  y.print();