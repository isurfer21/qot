use std::env::args;

fn main() {
    let args = args();
    argument_parser(args);
    // for _ in 0..args.count {
    //     println!("{}", args.select)
    // }

    
}

fn argument_parser(args) -> Vec<str> {
  let mut list = []; 
  for arg in args {
        println!("{}", arg);
    }
  return list
}