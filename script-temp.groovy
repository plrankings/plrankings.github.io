def lineas = """C#;5;5;0;4;5;1;5;5;0;6;5;-1
Go;9;9;0;17;18;1;14;16;2;15;17;2
PHP;6;8;2;5;3;-2;4;4;0;8;9;1
C++;2;4;2;6;6;0;6;6;0;4;3;-1
C;4;2;-2;6;6;0;9;9;0;2;2;0
VB.NET;26;19;-7;15;15;0;0;0;0;5;7;2
VB;26;19;-7;15;15;0;0;0;0;19;20;1
Swift;18;10;-8;9;9;0;11;10;-1;14;11;-3
Ruby;13;12;-1;12;11;-1;8;8;0;17;15;-2
Scala;0;0;0;14;14;0;12;14;2;29;20;-9
R;7;6;-1;7;7;0;14;12;-2;16;8;-8
Matlab;11;14;3;10;10;0;0;0;0;13;10;-3"""

lineas.eachLine{
def linea = it.split(";")
def rankings = ['ieee','pypl','redmonk','tiobe']
def positions = [linea[1],linea[4],linea[7],linea[10]]
def deltas = [linea[3],linea[6],linea[9],linea[12]]
def line = new Line(name: linea[0], rankings:rankings, positions:positions, deltas:deltas)
println(line)
}

class Line {
    String name
    List rankings
    List positions
    List deltas

    String toString() {
def delta_classes = []
def delta_value_classes = []
def tds=''
rankings.eachWithIndex{ r, i->
  def delta_neutral = deltas[i].toInteger()==0;
  def delta_up = delta_neutral ? false : deltas[i].toInteger() > 0 ? true : false;

  delta_classes += delta_up ?  "green fa fa-angle-up" : delta_neutral ? "neutral far fa-stop-circle" : "red fa fa-angle-down"
  delta_value_classes += delta_up ?  "green" : "red"
  def delta_b = delta_neutral ? "" : "<b class='${delta_value_classes[i]}'>${deltas[i].toInteger().abs()}</b>"

  tds+="""
            <td data-ranking="${rankings[i]}">
              <span>${positions[i]}</span>
              <i class="${delta_classes[i]}" aria-hidden="true"></i>
              ${delta_b}
            </td>
  """
}

"""
<tr>
            <td></td>
            <td>${name}</td>
            ${tds}
            <td><b></b></td>
          </tr>
"""
    }
}​​​
​